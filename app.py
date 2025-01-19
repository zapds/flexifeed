import os
import random
import openai
from dotenv import load_dotenv
import aiosqlite
from gnewsclient import gnewsclient
from playwright.async_api import async_playwright
import json
from aiohttp import WSMsgType, web
import asyncio
import asyncpg

load_dotenv()


app = web.Application()


async def get_news(language, location, topic, max_results):
    client = gnewsclient.NewsClient(
        language=language,
        location=location,
        topic=topic,
        max_results=max_results,
    )
    news = client.get_news()

    def predicate(url):
        return not url.startswith("https://news.google.com/")

    news_data = []
    async with async_playwright() as p:
        browser = await p.firefox.launch(headless=True)
        for article in news:
            page = await browser.new_page()
            await page.goto(
                article["link"],
                timeout=0,
            )
            try:
                await page.wait_for_url(predicate, wait_until="commit", timeout=5000)
            except:
                continue
            image_url = await page.query_selector("meta[property='og:image']")
            if image_url:
                article["image"] = await image_url.get_attribute("content")
            dat = {
                "url": page.url,
                "title": article["title"],
                "image": article["image"],
                "website": page.url.split("/")[2],
            }
            return json.dumps(dat)

async def get_summary(urls):
    async with async_playwright() as p:
        browser = await p.firefox.launch(headless=False)
        async def fetch_article(url):
            print("fetching article: ", url)
            page = await browser.new_page()
            await page.goto(f"about:reader?url={url}", wait_until="networkidle", timeout=0)
            print("waited for network idle")
            # page.wait_for_function("() => document.querySelector('html').innerText !== 'Loading…'")
            print("waiting for selector")
            try:
                await page.wait_for_selector("div.reader-message", state="hidden", timeout=5000)
            except Exception:
                return None
            print("selector hidden")
            text = await page.inner_text("html")
            return text
        texts = []
        tasks = [fetch_article(url) for url in urls]
        for coro in asyncio.as_completed(tasks):
            result = await coro
            if result:
                texts.append(result)
        # return "\n\n".join(texts)
        client = openai.OpenAI()

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a news reporter. Summarize the following news articles and present them combined like a news reporter on television. Use markdown to format your response to make it easy to read. There is no word limit, make sure to include only the most important points. Ignore any unnecessary details."},
                {"role": "user", "content": "\n\n".join(texts)},
            ],
        )
        output = str(completion.choices[0].message.content)
        inp = "\n\n".join(texts)
        return output


async def hello_world():
    return "Hello, world!"

async def genfeed(request):
    user_id = request.query.get("user_id")
    session_id = request.query.get("session_id")

    if not user_id or not session_id:
        return web.json_response({"error": "Missing user_id or session_id"}, status=400)

    conn = await asyncpg.connect(os.environ["DATABASE_URL"])
    session = await conn.fetchone(
        "SELECT * FROM session WHERE user_id = $1 AND id = $2", user_id, session_id)

    if not session:
        return web.json_response(
            {"error": "Invalid user_id or session_id"}, status=403
        )

    user_settings = await conn.fetchrow(
        "SELECT * FROM user_settings WHERE user_id = ?", user_id)

    if not user_settings:
        country = "India"
        topics = ["world", "nation", "technology", "sports", "science"]
    else:
        country = user_settings[1]
        topics = json.loads(user_settings[2])

    if not topics:
        topics = ["world", "nation", "technology", "sports", "science"]

    response = web.StreamResponse(
        status=200,
        reason="OK",
        headers={"Content-Type": "application/json"},
    )

    testing = True
    if testing:
        test_data = [{"url":"https://english.mathrubhumi.com/features/technology/robots-detect-emotions-skin-touch-1.10188034","title":"What if robots could read your feelings just by touching you? - Mathrubhumi English","description":"Comprehensive, up-to-date news coverage, aggregated from sources all over the world by Google News.","image":"https://english.mathrubhumi.com/image/contentid/policy:1.10188056:1734857644/robot.jpg?$p=dc2c136&f=16x9&w=1080&q=0.8","website":"english.mathrubhumi.com"},{"url":"https://www.newsx.com/tech-and-auto/google-doodle-today-celebrate-the-december-half-moon-with-an-exciting-interactive-card-game-play-now/","title":"Google Doodle Today: Celebrate The December Half Moon With An Exciting Interactive Card Game – Play Now! - NewsX","description":"Comprehensive, up-to-date news coverage, aggregated from sources all over the world by Google News.","image":"https://www.newsx.com/wp-content/uploads/2024/12/Google-Doodle-Today-Celebrate-The-December-Half-Moon.webp","website":"www.newsx.com"},{"url":"https://www.bizzbuzz.news/technology/apple-may-drop-iphone-se-series-for-new-iphone-16e-1346343","title":"Apple may drop iPhone SE series for new iPhone 16e - Bizz Buzz","description":"Comprehensive, up-to-date news coverage, aggregated from sources all over the world by Google News.","image":"https://www.bizzbuzz.news/h-upload/2024/12/21/1948524-screenshot-2024-12-21-at-84254-pm.jpg","website":"www.bizzbuzz.news"},{"url":"https://indianexpress.com/article/technology/mobile-tabs/best-midrange-phones-2024-poco-samsung-moto-realme-xiaomi-google-9738037/","title":"Google Pixel 8a to Poco F6: Phones that redefined the mid-range segment in 2024 - The Indian Express","description":"Comprehensive, up-to-date news coverage, aggregated from sources all over the world by Google News.","image":"https://images.indianexpress.com/2024/12/Best-midrange-phones-2024.png","website":"indianexpress.com"},{"url":"https://www.gsmarena.com/realme_14_pro_series_january_launch-news-65833.php","title":"Realme 14 Pro series is launching next month - GSMArena.com news - GSMArena.com","description":"Comprehensive, up-to-date news coverage, aggregated from sources all over the world by Google News.","image":"https://lh3.googleusercontent.com/J6_coFbogxhRI9iM864NL_liGXvsQp2AupsKei7z0cNNfDvGUmWUy20nuUhkREQyrpY4bEeIBuc=s0-w300","website":"www.gsmarena.com"}]
        await response.prepare(request)
        for i in range(5):
            for article in test_data:
                await asyncio.sleep(0.5)
                await response.write((json.dumps(article) + "\n").encode("utf-8"))
        await response.write_eof()
        return

    client = gnewsclient.NewsClient(
        language="en",
        location=country,
        topic=random.choice(topics),
        max_results=10,
        use_opengraph=True,
    )
    news = client.get_news()

    async def generate_results():
        async with async_playwright() as p:
            browser = await p.firefox.launch(headless=True)
            try:

                async def fetch_news(article):
                    page = await browser.new_page()
                    try:
                        await page.goto(article["link"], timeout=0)

                        def predicate(url):
                            return not url.startswith("https://news.google.com/")

                        try:
                            await page.wait_for_url(predicate, wait_until="commit", timeout=10000)
                        except:
                            pass

                        image_url = await page.query_selector(
                            "meta[property='og:image']"
                        )
                        if image_url:
                            article["image"] = await image_url.get_attribute("content")
                        return {
                            "url": page.url,
                            "title": article["title"],
                            # "description": article["description"],
                            "image": article.get("image"),
                            "website": page.url.split("/")[2],
                        }
                    except Exception:
                        return None
                    finally:
                        await page.close()

                tasks = [fetch_news(article) for article in news]
                for coro in asyncio.as_completed(tasks):
                    result = await coro
                    if result:
                        yield result
            finally:
                await browser.close()

    await response.prepare(request)
    async for result in generate_results():
        await response.write((json.dumps(result) + "\n").encode("utf-8"))

    await response.write_eof()
    return response

async def summarize(request):
    user_id = request.query.get("user_id")
    session_id = request.query.get("session_id")

    print("user_id: ", user_id)
    print("session_id: ", session_id)
    if not user_id or not session_id:
        return web.json_response({"error": "Missing user_id or session_id"}, status=400)
    
    urls = request.query.get("urls")
    if not urls:
        return web.json_response({"error": "Missing urls"}, status=400)

    urls = urls.split(",")
    summary = await get_summary(urls)
    return web.json_response({"summary": summary})


async def ws_genfeed(request):
    user_id = request.query.get("user_id")
    session_id = request.query.get("session_id")

    print("user_id: ", user_id)
    print("session_id: ", session_id)
    if not user_id or not session_id:
        return web.json_response({"error": "Missing user_id or session_id"}, status=400)
    
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    timeout = 300  # Set timeout for the WebSocket connection
    browser = None
    browser_task = None
    news_cache = {}

    try:
        async with async_playwright() as p:
            browser = await p.firefox.launch(headless=True)
            async def fetch_articles(topic):
                if topic in news_cache:
                    if not news_cache[topic]:
                        return
                    news = news_cache[topic][:5]
                    news_cache[topic] = news_cache[topic][5:]
                else:
                    client = gnewsclient.NewsClient(
                        language="en",
                        location="India",
                        max_results=10,
                        topic=topic,
                    )
                    news = client.get_news()
                    news_cache[topic] = news[5:]
                async def fetch_article_data(article):
                    page = await browser.new_page()
                    try:
                        await page.goto(article["link"], timeout=0)
                        def predicate(url):
                            return not url.startswith("https://news.google.com/")

                        try:
                            await page.wait_for_url(
                                predicate, wait_until="commit", timeout=10000
                            )
                        except:
                            pass

                        image_url = await page.query_selector(
                            "meta[property='og:image']"
                        )
                        article["image"] = (
                            await image_url.get_attribute("content")
                            if image_url
                            else None
                        )
                        return {
                            "url": page.url,
                            "title": article["title"],
                            "image": article.get("image"),
                            "website": page.url.split("/")[2],
                            "topic": topic,
                        }
                    except Exception:
                        return None
                    finally:
                        await page.close()

                tasks = [fetch_article_data(article) for article in news[:5]]
                for coro in asyncio.as_completed(tasks):
                    result = await coro
                    if result:
                        await ws.send_json(result)

            async def browser_handler():
                while True:
                    msg = await ws.receive()

                    if msg.type == WSMsgType.TEXT:
                        topic = msg.data.strip()
                        if topic.lower() == "close":
                            await ws.close()
                            break
                        elif topic:
                            await fetch_articles(topic)
                    elif msg.type in (WSMsgType.CLOSE, WSMsgType.ERROR):
                        break

            browser_task = asyncio.create_task(browser_handler())
            await asyncio.wait_for(browser_task, timeout=timeout)

    except asyncio.TimeoutError:
        await ws.send_json({"error": "Connection timed out"})
    except Exception as e:
        await ws.send_json({"error": str(e)})
    finally:
        if browser_task and not browser_task.done():
            browser_task.cancel()
        if browser:
            await browser.close()
        await ws.close()

    return ws


app.router.add_get('/', hello_world)
app.router.add_get('/genfeed', genfeed)
app.router.add_get('/summarize', summarize)
app.router.add_get("/ws-genfeed", ws_genfeed)


if __name__ == '__main__':
    web.run_app(app, port=3001)
