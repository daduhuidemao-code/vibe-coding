import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from schemas import Article
from config import get_email_config, get_webhook_config
import requests


def send_email_notification(articles: List[Article]) -> bool:
    config = get_email_config()
    if not config.get("enabled", False):
        return False
    
    try:
        smtp_host = config["smtp_host"]
        smtp_port = config["smtp_port"]
        smtp_user = config["smtp_user"]
        smtp_password = config["smtp_password"]
        smtp_from = config["smtp_from"]
        smtp_tls = config.get("smtp_tls", True)
        
        subject = f"新文章通知 - {len(articles)} 篇新文章"
        body = "\n\n".join([
            f"标题: {article.title}\n链接: {article.link}\n摘要: {article.summary or '无'}"
            for article in articles
        ])
        
        msg = MIMEMultipart()
        msg["From"] = smtp_from
        msg["To"] = smtp_user
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            if smtp_tls:
                server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_from, smtp_user, msg.as_string())
        
        return True
    except Exception as e:
        print(f"Email notification failed: {e}")
        return False


def send_webhook_notification(articles: List[Article]) -> bool:
    config = get_webhook_config()
    if not config.get("enabled", False):
        return False
    
    try:
        url = config["url"]
        method = config.get("method", "POST").upper()
        
        payload = {
            "count": len(articles),
            "articles": [
                {
                    "title": article.title,
                    "link": article.link,
                    "summary": article.summary,
                    "published_at": article.published_at.isoformat() if article.published_at else None
                }
                for article in articles
            ]
        }
        
        response = requests.request(method, url, json=payload)
        return response.status_code == 200
    except Exception as e:
        print(f"Webhook notification failed: {e}")
        return False


def notify_new_articles(articles: List[Article]) -> None:
    send_email_notification(articles)
    send_webhook_notification(articles)