import re
from html.parser import HTMLParser
from typing import Optional
from config import get_summary_config


class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.fed = []

    def handle_data(self, d):
        self.fed.append(d)

    def get_data(self):
        return "".join(self.fed)


def strip_tags(html: str) -> str:
    if not html:
        return ""
    s = MLStripper()
    s.feed(html)
    return s.get_data()


def generate_summary(content: str, max_length: Optional[int] = None) -> str:
    if not content:
        return ""

    config = get_summary_config()
    if not config.get("enabled", True):
        return ""

    if max_length is None:
        max_length = config.get("max_length", 200)

    text = strip_tags(content)
    
    text = re.sub(r"\s+", " ", text).strip()
    
    if len(text) <= max_length:
        return text

    sentences = re.split(r"(?<=[。！？.!?])\s+", text)
    
    summary = ""
    for sentence in sentences:
        if len(summary) + len(sentence) <= max_length:
            if summary:
                summary += " "
            summary += sentence
        else:
            break
    
    if len(summary) < max_length and len(text) > max_length:
        summary = text[:max_length].rstrip()
        if summary[-1] not in ".!？。！":
            summary += "..."
    
    return summary.strip()