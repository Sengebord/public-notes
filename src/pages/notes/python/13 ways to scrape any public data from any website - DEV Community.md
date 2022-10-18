---
link: https://dev.to/serpapi/13-ways-to-scrape-any-public-data-from-any-website-1bn9
received: '2022-10-18T20:53:46.024368+00:00'
tags:
- python
- scraping
title: "13 ways to scrape any public data from any website - DEV Community \U0001F469\u200D\U0001F4BB\U0001F468\u200D\U0001F4BB"
---
https://dev.to/serpapi/13-ways-to-scrape-any-public-data-from-any-website-1bn9#scraping
___
📃Table of Contents
-
[CSS Selectors or/and XPath](#css-xpath) [Scraping From Meta Elements](#meta-elements) [Scraping With Regular Rxpression](#scraping-with-regular-expressions)
-
[Python Web Scraping Tools](#webscraping-parsers)
-
[Python Browser Automation](#browser-automation)
-
[Python Web Scraping Frameworks](#webscraping-frameworks)
-
-
-
[Reverse engineering & Debugging](#reverse-engineering-debugging)
## Intro
This ongoing blog post is about understanding ways of extracting data from any website, either if the website is static/fully JavaScript driven or if reverse engineering needs to be applied.
After this blog post, you can understand and apply this knowledge to create structured data from a messy data from any website.
At SerpApi we're extracting data from all sorts of websites and each one of them requires a specific approach that will able us to parse data fast and efficient, and most importantly without browser automation. We want to share a little of our knowledge gained while building our APIs.
📌 Some of the techniques will not be mentioned intentionally in order not to disclose some of the methods we use.
Shown tips should be plenty enough to get you going or understand where to potentially look to solve the problem.
🐍 This blog post uses Python as language to show code examples.
## Browser Dev Tools
Dev tools is possibly one of very first thing that needs to be checked before writing actual code.
I myself, wrote quite a lot of code before looking at dev tools with realization that instead of parsing data, I can made a simple HTTP request, either
GET or
POST to website API/server and get a JSON response with all the necessary data that being already structured.
Under dev tools, you can find a Elements, Network and Source/Application tabs.
The follow-up sections will go from easiest to hardest methods with tools that can be used to make the job done.
## CSS Selectors or/and XPath
### CSS Selectors
CSS selectors are patterns used to select match the element(s) you want to
~~style~~ extract from HTML page.
While for building websites CSS selectors help to style the website, in webscraping those selectors used to match certain HTML nodes (elements) from which we want data to be extracted.
We've covered
[types of selectors with actual code examples](https://serpapi.com/blog/web-scraping-with-css-selectors-using-python/#selectors_types) in the web scraping with CSS selectors blog post and which selector works best for a particular task, and how to test them in the browser.
### Type of Selectors
There're a few often used type of selectors:
|Selector Type||Syntax||Purpose|
|
|
element_name
[Class Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)
.class_name
[ID Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors)
#id_value
[Attribute Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)
[attribute=attribute_value]/
[attribute]
[Selector List](https://developer.mozilla.org/en-US/docs/Web/CSS/Selector_list)
element, element, element, .../
selector, selector, selector, ...
[Descendant combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator)
selector1 selector2
### XPath
[XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) is a query language that used to navigate [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction#what_is_the_dom) and could be is more flexible than CSS selectors.
It's mostly helpful when HTML element doesn't have a selector name, or has a very weird location in a messy HTML. XPath uses expressions to create a query:
//div[@class='content']//text()[not(ancestor::div/@class[contains(., 'code')])][normalize-space()]
### SelectorGadget Chrome Extension
[SelectorGadget](https://selectorgadget.com/) extension allows to quickly grab CSS selector(s) by clicking on desired element in your browser. It returns a CSS selector(s).
Example of selecting certain HTML elements and returned CSS selector(s):
We've shown
[how SelectorGadget works](https://serpapi.com/blog/web-scraping-with-css-selectors-using-python/#css_gadget) in a separate web scraping with CSS selectors blog post.
### Scraping from Meta Elements
Selectors are not the only place where valuable data could be extracted. Some of the data can be directly in the HTML
[. <meta> elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
<meta>element loads no matter if the page is static or dynamic.
For example, on Medium you can extract basic profile info from
<meta> elements:
import requests from bs4 import BeautifulSoup html = requests.get('https://medium.com/@dimitryzub').text soup = BeautifulSoup(html, 'html.parser') description = soup.select('meta')[13]['content'] link = soup.select('meta')[16]['content'] profile_picture = soup.select('meta')[21]['content'] print(description, link, profile_picture, sep='\n') ''' Read writing from Dmitriy Zub ☀️ on Medium. Developer Advocate at SerpApi. I help to make structured data from a pile of mess. https://dimitryzub.medium.com https://miro.medium.com/max/2400/1*he-C8WKaIjHIe58F4aMyhw.jpeg '''
|Code||Explanation|
|
|
'meta'elemets
[<number>]
listof extracted elements (nodes)
['content']
### Scraping From Tables
Scraping tables is an additional separate thing that can be done either with
[ or parsel](https://parsel.readthedocs.io/en/latest/) [web scraping libraries. However,](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
bs4
[simplifies this task a lot by providing a](https://pandas.pydata.org/)
pandas
[method that can parse data from the](https://pandas.pydata.org/docs/reference/api/pandas.read_html.html)
read_html()
<table>.
Installation:
$ pip install pandas
A basic example of extracting table data from Wikipedia:
import pandas as pd table = pd.read_html('https://en.wikipedia.org/wiki/History_of_Python')[0] # [0] = first table df = pd.DataFrame(data=table[['Latest micro version', 'Release date']]) # grabs 2 columns # df.set_index('Latest micro version', inplace=True) # drops default pandas DataFrame indexes, but can't be used in a for loop print(df) for data in df['Latest micro version']: print(data)
Outputs:
Latest micro version Release date 0 0.9.9[2] 1991-02-20[2] 1 1.0.4[2] 1994-01-26[2] 2 1.1.1[2] 1994-10-11[2] 3 NaN 1995-04-13[2] 4 NaN 1995-10-13[2] 5 NaN 1996-10-25[2] 6 1.5.2[42] 1998-01-03[2] 7 1.6.1[42] 2000-09-05[43] 8 2.0.1[44] 2000-10-16[45] 9 2.1.3[44] 2001-04-15[46] 10 2.2.3[44] 2001-12-21[47] 11 2.3.7[44] 2003-06-29[48] 12 2.4.6[44] 2004-11-30[49] 13 2.5.6[44] 2006-09-19[50] 14 2.6.9[27] 2008-10-01[27] 15 2.7.18[32] 2010-07-03[32] 16 3.0.1[44] 2008-12-03[27] 17 3.1.5[52] 2009-06-27[52] 18 3.2.6[54] 2011-02-20[54] 19 3.3.7[55] 2012-09-29[55] 20 3.4.10[56] 2014-03-16[56] 21 3.5.10[58] 2015-09-13[58] 22 3.6.15[60] 2016-12-23[60] 23 3.7.13[61] 2018-06-27[61] 24 3.8.13[62] 2019-10-14[62] 25 3.9.14[63] 2020-10-05[63] 26 3.10.7[65] 2021-10-04[65] 27 3.11.0rc2[66] 2022-10-24[66] 28 NaN 2023-10[64] 29 Legend: Old versionOlder version, still maintainedLate... 30 Italics indicates the latest micro version of ... Italics indicates the latest micro version of ...
for loop output:
0.9.9[2] 1.0.4[2] 1.1.1[2] nan nan nan 1.5.2[42] 1.6.1[42] 2.0.1[44] 2.1.3[44] 2.2.3[44] 2.3.7[44] 2.4.6[44] 2.5.6[44] 2.6.9[27] 2.7.18[32] 3.0.1[44] 3.1.5[52] 3.2.6[54] 3.3.7[55] 3.4.10[56] 3.5.10[58] 3.6.15[60] 3.7.13[61] 3.8.13[62] 3.9.14[63] 3.10.7[65] 3.11.0rc2[66] nan Legend: Italics indicates the latest micro version of currently supported versions as of 2022-07-11[needs update].
Keep in mind that those are just examples and additional data cleaning needs to be applied to make this data usable 🙂
Have a look at the
[gotchas that could happen with read_html()](https://pandas.pydata.org/docs/user_guide/io.html#io-html-gotchas):
### Scraping with Regular Expression
Scraping with regular expression in Python is possible by
[ module. re](https://docs.python.org/3/library/re.html) **Why scrape data with regular expressions in the first place**?
- if the HTML structure is very, very messy.
- if there are not CSS selectors and XPath didn't work also.
- if the data you want is directly in the text string.
- similar reasons to mention above.
There're a few main methods that could be used:
|Method||Purpose|
|
|
listof matches. To find all occurrences.
re.search()
re.match()
search()vs
match()
group()
import re dummy_text = ''' Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. ''' dates = re.findall(r'\d{1}\.\d{2}\.\d{2}', dummy_text) # https://regex101.com/r/VKYiA9/1 years_bc = re.findall(r'\d+\s?\bBC\b', dummy_text) # https://regex101.com/r/ApypoB/1 print(dates) print(years_bc) # ['1.10.32', '1.10.33', '1.10.32'] # ['45 BC', '45 BC']
Here's a visualization of what is being matched by the regular expressions above:
The above regular expressions read like this:
## Python Web Scraping Tools
In this section, we'll go over most popular Python web scraping tools that can extract data from static and dynamic websites.
### Python Parsing Libraries
There're a few Python web scraping packages/libraries to parse data from websites that are not JavaScript driven as such packages are designed to scrape data from static pages.
### Parsel
[ is a library built to extract data from XML/HTML documents with XPath and CSS selectors support, and could be combined with Parsel](//parsel.readthedocs.io/en/latest/) [regular expressions](https://docs.python.org/3/library/re.html). It uses [parser under the hood by default.](https://lxml.de/)
lxml
The great thing I like about
parsel (apart from XPath support) is that it returns
None if certain data is not present, so there's no need to create a lot of
try/except blocks to the same thing that looks ugly.
Installation:
$ pip install parsel
A few examples of extraction methods:
variable.css(".X5PpBb::text").get() # returns a text value variable.css(".gs_a").xpath("normalize-space()").get() # https://github.com/scrapy/parsel/issues/192#issuecomment-1042301716 variable.css(".gSGphe img::attr(srcset)").get() # returns a attribute value variable.css(".I9Jtec::text").getall() # returns a list of strings values variable.xpath('th/text()').get() # returns text value using xpath
|Code||Explanation|
|
|[CSS query traslates to XPath using](https://github.com/scrapy/parsel/blob/90397dcd0b2c1cbb91e44f65c50f9e11628ba028/parsel/selector.py#L357-L358)under the hood.
csselectpackage
::textor
::attr(<attribute>)
get()
parsel
getall()
listof matches.
.xpath('th/text()')
<th>element
Practical example using
parsel:
# https://serpapi.com/blog/scrape-naver-related-search-results-with-python/#full_code import requests, json from parsel import Selector # https://docs.python-requests.org/en/master/user/quickstart/#passing-parameters-in-urls params = { "query": "minecraft", # search query "where": "web" # web results. works with nexearch as well } # https://docs.python-requests.org/en/master/user/quickstart/#custom-headers headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36" } html = requests.get("https://search.naver.com/search.naver", params=params, headers=headers, timeout=30) selector = Selector(html.text) related_results = [] # https://www.programiz.com/python-programming/methods/built-in/enumerate for index, related_result in enumerate(selector.css(".related_srch .keyword"), start=1): keyword = related_result.css(".tit::text").get().strip() link = f'https://search.naver.com/search.naver{related_result.css("a::attr(href)").get()}' related_results.append({ "position": index, # 1,2,3.. "title": keyword, "link": link }) print(json.dumps(related_results, indent=2, ensure_ascii=False))
### BeautifulSoup
[ is also a library that build to extract data from HTML/XML documents. It's also could be combined with BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) [parser and also can be used in combo with regular expressions.](https://lxml.de/)
lxml
Unlike
parsel,
BeautifulSoup don't have support for XPath which would be pretty handy is some situations. Additionally, it lacks
getall() method that returns a
list of matches which is shorthand of list comprehension, and it needs a lot of
try/except to handle missing data.
However, it can create new HTML nodes, for example, using
[ method or other methods for similar things. wrap()](https://www.crummy.com/software/BeautifulSoup/bs4/doc/#wrap)
It's very handy if parts of the data you want to extract not properly structured e.g. HTML table without
<table>...</table> element.
You can create this element and then easily parse table data with
pandas
[ method. read_html()](https://pandas.pydata.org/docs/reference/api/pandas.read_html.html)
Installation:
$ pip install bs4
A few examples of extraction methods using
[: select() and select_one()](https://www.crummy.com/software/BeautifulSoup/bs4/doc/#css-selectors)
variable.select('.gs_r.gs_or.gs_scl') # return a list of matches variable.select_one('.gs_rt').text # returns a single text value match variable.select_one('.gs_rt a')['href'] # returns a single attribute value match
Practical example using
BeautifulSoup:
# https://stackoverflow.com/a/71237540/15164646 from bs4 import BeautifulSoup import requests, lxml params = { "user": "VxOmZDgAAAAJ", # user-id, in this case Masatoshi Nei "hl": "en", # language "gl": "us", # country to search from "cstart": 0, # articles page. 0 is the first page "pagesize": "100" # articles per page } headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36" } all_articles = [] html = requests.post("https://scholar.google.com/citations", params=params, headers=headers, timeout=30) soup = BeautifulSoup(html.text, "lxml") for index, article in enumerate(soup.select("#gsc_a_b .gsc_a_t"), start=1): article_title = article.select_one(".gsc_a_at").text article_link = f'https://scholar.google.com{article.select_one(".gsc_a_at")["href"]}' article_authors = article.select_one(".gsc_a_at+ .gs_gray").text article_publication = article.select_one(".gs_gray+ .gs_gray").text all_articles.append({ "title": article_title, "link": article_link, "authors": article_authors, "publication": article_publication })
## Python Browser Automation
Browser automation is handy when you need to perform some sort of interaction with the webiste, for example, scrolling, clicks and similar things.
Such things could be done without browser automation, this is how we tend to do at SerpApi, however, it could be very complicated but on the flip side, the reward is much faster data extraction.
### Playwright
[ is a modern alternative to playwright](https://playwright.dev/python/)
selenium. It can perform pretty much all interactions as user would do i.e clicks, scrolls and many more.
Installation:
$ pip install playwright
A practical example of website interaction using
playwright and
parsel to extract the data.
The following script scrolls through all Google Play app reviews and then extract data:
# https://serpapi.com/blog/scrape-all-google-play-app-reviews-in-python/#full_code import time, json, re from parsel import Selector from playwright.sync_api import sync_playwright def run(playwright): page = playwright.chromium.launch(headless=True).new_page() page.goto("https://play.google.com/store/apps/details?id=com.collectorz.javamobile.android.books&hl=en_GB&gl=US") user_comments = [] # if "See all reviews" button present if page.query_selector('.Jwxk6d .u4ICaf button'): print("the button is present.") print("clicking on the button.") page.query_selector('.Jwxk6d .u4ICaf button').click(force=True) print("waiting a few sec to load comments.") time.sleep(4) last_height = page.evaluate('() => document.querySelector(".fysCi").scrollTop') # 2200 while True: print("scrolling..") page.keyboard.press("End") time.sleep(3) new_height = page.evaluate('() => document.querySelector(".fysCi").scrollTop') if new_height == last_height: break else: last_height = new_height selector = Selector(text=page.content()) page.close() print("done scrolling. Extracting comments...") for index, comment in enumerate(selector.css(".RHo1pe"), start=1): user_comments.append({ "position": index, "user_name": comment.css(".X5PpBb::text").get(), "app_rating": re.search(r"\d+", comment.css(".iXRFPc::attr(aria-label)").get()).group(), "comment_date": comment.css(".bp9Aid::text").get(), "developer_comment": { "dev_title": comment.css(".I6j64d::text").get(), "dev_comment": comment.css(".ras4vb div::text").get(), "dev_comment_date": comment.css(".I9Jtec::text").get() } }) print(json.dumps(user_comments, indent=2, ensure_ascii=False)) with sync_playwright() as playwright: run(playwright)
### Selenium
[ is very similar to selenium](https://www.selenium.dev/)
playwrightbut a little older with slightly different approaches of doing things.
$ pip install selenium
The following script performs a scroll until hits the very bottom of Google Play search and then extracts each section with games:
from selenium import webdriver from selenium.webdriver.chrome.service import Service from webdriver_manager.chrome import ChromeDriverManager from selenium.webdriver.common.by import By from selenium.webdriver.support.wait import WebDriverWait from selenium.webdriver.support import expected_conditions as EC from parsel import Selector import json, time google_play_games = { 'Top charts': { 'Top free': [], 'Top grossing': [], 'Top paid': [] }, } def scroll_page(url): service = Service(ChromeDriverManager().install()) options = webdriver.ChromeOptions() options.add_argument("--headless") options.add_argument("--lang=en") options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36") driver = webdriver.Chrome(service=service, options=options) driver.get(url) while True: try: scroll_button = driver.find_element(By.CSS_SELECTOR, '.snByac') driver.execute_script("arguments[0].click();", scroll_button) WebDriverWait(driver, 10000).until(EC.visibility_of_element_located((By.TAG_NAME, 'body'))) break except: driver.execute_script("window.scrollTo(0, document.body.scrollHeight);") WebDriverWait(driver, 10000).until(EC.visibility_of_element_located((By.TAG_NAME, 'body'))) selector = Selector(driver.page_source) driver.quit() return selector def scrape_all_sections(selector): for section in selector.css('.Ubi8Z section'): section_title = section.css('.kcen6d span::text').get() time.sleep(2) google_play_games[section_title] = [] for game in section.css('.TAQqTe'): title = game.css('.OnEJge::text').get() link = 'https://play.google.com' + game.css('::attr(href)').get() category = game.css('.ubGTjb .sT93pb.w2kbF:not(.K4Wkre)::text').get() rating = game.css('.CKzsaf .w2kbF::text').get() rating = float(rating) if rating else None google_play_games[section_title].append({ 'title': title, 'link': link, 'category': category, 'rating': rating, }) print(json.dumps(google_play_games, indent=2, ensure_ascii=False)) def scrape_google_play_games(): params = { 'device': 'phone', 'hl': 'en_GB', # language 'gl': 'US', # country of the search } URL = f"https://play.google.com/store/games?device={params['device']}&hl={params['hl']}&gl={params['gl']}" result = scroll_page(URL) scrape_all_sections(result) if __name__ == "__main__": scrape_google_play_games()
## Python Web Scraping Frameworks
### Scrapy
[ is a high-level webscraping framework designed to scrape data at scale and can be used to create a whole scrapy](https://scrapy.org/) [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load)pipeline.
However, you have to keep in mind that it's bulky, and could be quite confusing, and while it provides a lot of things for you, most of those things you may not need.
Installation:
$ pip install scrapy
Very simple
scrapy script:
import scrapy class ScholarAuthorTitlesSpider(scrapy.Spider): name = 'google_scholar_author_titles' def scrapy_request(self): params = { "user": "cp-8uaAAAAAJ", # user-id "hl": "en", # language "gl": "us", # country to search from "cstart": 0, # articles page. 0 is the first page "pagesize": "100" # articles per page } headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36" } yield scrapy.Request(url="https://scholar.google.com/citations", method="GET", headers=headers, meta=params, callback=self.parse) def parse(self, response): for index, article in enumerate(response.css("#gsc_a_b .gsc_a_t"), start=1): yield { "position": index, "title": article.css(".gsc_a_at::text").get(), "link": f'https://scholar.google.com{article.css(".gsc_a_at::attr(href)").get()}', "authors": article.css(".gsc_a_at+ .gs_gray::text").get(), "publication": article.css(".gs_gray+ .gs_gray::text").get() }
## XHR Requests
[XHR request allows to talk to the server](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) by making a request and getting data back in response. It's one of the first things that you can check before writing actual code. Those requests can be used to get data directly from website's "source" without the need to use parsing libraries/frameworks.
To find a certain XHR request you need:
- Open browser dev tools (
F12)
- Network
- Fetch/XHR
- Refresh page as data may come on page update.
- Click through every request and see if there's any data you want.
If you find the request with the data you want, you can preview the data (example from the
[Poocoin.app](https://poocoin.app/)):
### How extract data from XHR request
When making XHR request, we need to pass
[URL parameters](https://requests.readthedocs.io/en/latest/user/quickstart/#passing-parameters-in-urls) that server can understand and "reply" to us.
Here's a simple illustration of that process:
To find those headers and URL query parameters, we need to go to the certain URL and look at Headers and Payload tabs and make sure we see what request method is used (
GET,
POST, etc).
We can do it like so:
- Copy URL as CURL (Bash) and use it with online CURL runner or tools such as
[Insomnia](https://insomnia.rest/).
- Copy request URL under headers tab.
From Insomnia (URL copied from the XHR->Headers tab).
📌Keep in mind that some of the passed URL parameters need to be scraped and passed to the URL beforehand (before making request to the server/api). URL can have some sort of a unique token or something different and can't be worked without it.
If the response is successful and you want to make an exact request in the script, those parameters could be automatically generated with tools such as Insomnia (or other alternatives) where you can test different types of requests with different parameters and headers.
Simple example but same approach will be on other websites with or without passing
[URL parameters](https://requests.readthedocs.io/en/latest/user/quickstart/#passing-parameters-in-urls) and [headers](https://requests.readthedocs.io/en/latest/user/quickstart/#custom-headers):
import requests # https://requests.readthedocs.io/en/latest/user/quickstart/#json-response-content html = requests.get('https://api.chucknorris.io/jokes/random').json() print(html['value']) # Once, due to an engine stall of his F-22 Raptor during a Dessert Storm sorte', Chuck Norris had to ejaculate over the Red Sea.
## Page Source
This is the next thing that could be checked after
Dev Tools ->
XHR. It's about looking at page source and trying to find the data there, that are either hidden in the rendered HTML or can't be scraped with selectors because it's being rendered by JavaScript.
One of the ways to find if there's the data you want is in the inline JSON or not:
- select and copy any type of data you want to extract (title, name, etc.)
- open page source
CTRL + U
- find the data
CTRL + F, if some of the occurrences will be inside
<script>elements then congratulation, you found inline JSON or something similar 🙂
### Inline JSON
Here's a visual example of how inline JSON could look like (from the TripAdvisor):
When we found that there's a data we want locates in the inline JSON, there're a few ways to extract it:
- using regular expression to extract parts of the inline JSON.
- (if needed) once again using regular expression(s) to extract the portion of the data: links, dates, emails, etc.
- using regular expression to parse inline JSON and covert it to usable JSON that could be used as a Python
dict.
#### Extract inline JSON data with Regex
The following example is from our
[Google Arts & Culture - Artists](https://serpapi.com/blog/scrape-google-arts-artists-all-az-time-results/#fullcode) blog post where we
select() all
<script> elements and then extract other data from matched element(s) using regular expressions:
from bs4 import BeautifulSoup import requests, json, re, lxml headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' } params = { 'tab': 'pop' } html = requests.get(f'https://artsandculture.google.com/category/artist', params=params, headers=headers, timeout=30) soup = BeautifulSoup(html.text, 'lxml') # 👇👇👇 data extraction all_script_tags = soup.select('script') # https://regex101.com/r/JQXUBm/1 portion_of_script_tags = re.search('("stella\.common\.cobject",".*)\[\[\"A",\["stella\.pr","PrefixedAssets', str(all_script_tags)).group(1) # https://regex101.com/r/c9m9B0/1 authors = re.findall(r'"stella\.common\.cobject","(.*?)","\d+', str(portion_of_script_tags))
|Code||Explanation|
|
|
listof matches.
re.search()
group()
#### Extract inline JSON data with Regex and convert usable JSON
The following example is from one of our
[Scrape Google Play Store App in Python](https://serpapi.com/blog/scrape-google-play-store-app-in-python/#full_code) blog posts.
The flow would be to also parse
<script> elements with regex and then turn it into
dict using
[: json.loads()](https://docs.python.org/3/library/json.html#json.loads)
json.loads( re.findall( r"<script nonce=\"\w+\" type=\"application/ld\+json\">({.*?)</script>", # regular expression str(soup.select("script")[11]), # input from where to search data re.DOTALL, # match any character: https://docs.python.org/3/library/re.html#re.DOTALL )[0] # access `list` from re.finall() ) # convert to `dict` using json.loads()
After that, we can access it as a dictionary:
app_data["basic_info"]["name"] = basic_app_info.get("name") app_data["basic_info"]["type"] = basic_app_info.get("@type") app_data["basic_info"]["url"] = basic_app_info.get("url")
Full example:
from bs4 import BeautifulSoup import requests, lxml, re, json headers = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36" } params = { "id": "com.nintendo.zara", # app name "gl": "US", # country of the search "hl": "en_GB" # language of the search } # make a request and pass response to BeautifulSoup html = requests.get("https://play.google.com/store/apps/details", params=params, headers=headers, timeout=30) soup = BeautifulSoup(html.text, "lxml") # where all app data will be stored app_data = { "basic_info": {} } # 👇👇👇 data extraction # [11] index is a basic app information # https://regex101.com/r/zOMOfo/1 basic_app_info = json.loads(re.findall(r"<script nonce=\"\w+\" type=\"application/ld\+json\">({.*?)</script>", str(soup.select("script")[11]), re.DOTALL)[0]) app_data["basic_info"]["name"] = basic_app_info.get("name") app_data["basic_info"]["type"] = basic_app_info.get("@type") app_data["basic_info"]["url"] = basic_app_info.get("url")
## Reverse engineering & Debugging
The great examples of reverse engineering at our blog:
Make sure to check them both as here we're not going to duplicate the same information.
📌Information about Source and Application tabs is kinda introductory information as it's a big topics with a lot of steps to reproduce and it will be out of the scope of this blog post.
### Sources tab
One of the approaches, when something complex needs to be extracted, could be done under the Source tab.
It could be done by debugging website JS source code from certain files with debugger breakpoints (
Dev tools ->
sources ->
debugger) by trying to trace what is going on in the code and how can we intercept/create by ourselves data and use it the parser.
We've also done a
[SerpApi Podcast about scraping dynamic websites](https://www.youtube.com/watch?v=xMqAIlG4cUo&t=1315s) which is essentially the topic about using Source tab.
In this video Ilya told about his approach about investigating and reproducing Google Maps data URL parameter which defines data about certain Google Maps place. This parameter hold data about place id, latitude and longitude.
### Application tab
A similar thing could be done in the
Dev tools ->
Application tab where we see, for example, cookies data and either intercept it on reverse engineer it by understanding how this cookie was built.
Ilya, one of the engineers at SerpApi has written in more detail about
[reverse engineering Location cookies from Walmart](https://serpapi.com/blog/scrape-walmart-search-results-for-a-specific-store-id-with-plain-http-requests/#location-cookies) and his approach for such task.
## Links
Join us on
[YouTube](https://www.youtube.com/channel/UCUgIHlYBOD3yA3yDIRhg_mg)
## Top comments (0)