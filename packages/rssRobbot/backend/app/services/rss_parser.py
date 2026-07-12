import feedparser
from datetime import datetime
from typing import List, Dict, Optional
from schemas import ArticleBase
from .summarizer import generate_summary


def parse_rss_feed(feed_url: str) -> Dict:
    feed = feedparser.parse(feed_url)
    
    result = {
        "title": feed.feed.get("title", ""),
        "description": feed.feed.get("description", ""),
        "articles": []
    }
    
    for entry in feed.entries:
        content = get_entry_content(entry)
        summary = entry.get("summary", "")
        
        if not summary and content:
            summary = generate_summary(content)
        
        article = ArticleBase(
            title=entry.get("title", ""),
            link=entry.get("link", ""),
            content=content,
            summary=summary,
            published_at=parse_datetime(entry.get("published"))
        )
        result["articles"].append(article)
    
    return result


def get_entry_content(entry: Dict) -> Optional[str]:
    if "content" in entry:
        for content in entry.content:
            if content.type in ["text/html", "application/xhtml+xml"]:
                return content.value
        return entry.content[0].value
    elif "summary" in entry:
        return entry.summary
    return None


def parse_datetime(date_str: Optional[str]) -> Optional[datetime]:
    if not date_str:
        return None
    
    try:
        parsed = feedparser.parse(date_str)
        if parsed.get("updated_parsed"):
            return datetime(*parsed.updated_parsed[:6])
    except Exception:
        pass
    
    for fmt in ["%a, %d %b %Y %H:%M:%S %Z", "%Y-%m-%dT%H:%M:%SZ"]:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    
    return None