# 
# track_tumblr.py
# 
# Created on: March 3, 2013
#     Author: Matt Green
# 
# Crawler to automatically generate reports on Tumblr usage
# 
# 

import httplib2
import simplejson as json
from datetime import datetime

# Create your consumer with the proper key/secret.
client_key="Wd7R7xxTHAtL0rTfEnmsgQhAZESE4aTz5tTbEPzpXZIMHvFKe0"

tumblr_base = "http://api.tumblr.com/v2/blog/"

tumblr = httplib2.Http(".cache")

current_date = datetime.now()

report_file = open(current_date.strftime('%Y-%m-%d') + "_report.tsv", "w")
log_file = open('tumblr_crawler.log', 'a')
config_file = open("tumblr_posts.txt")

sep = "\t"

# array of dictionaries containing the info about each post retrieved
# will allow entries to be sorted in the future
post_info = []

report_file.writelines("Current Date" + sep + current_date.ctime() + "\n")
report_file.writelines("Poster"+sep+
            "Date Time Posted"+sep+
            "Tags"+sep+
            "Likes"+sep+
            "Reblogs"+sep+
            "Ascot Link" +sep+
            "Tumblr Link\n")


log_file.writelines(current_date.strftime('%Y-%m-%d %H:%M:%S') + ": Tracker started\n")

tumblr_blogs = config_file.read().strip().split('#')
tumblr_blogs.remove('')
for blog in tumblr_blogs:
  post_list = blog.strip().split()
  blog_base = post_list.pop(0).strip()

  for post_id in post_list:
    request_url = (tumblr_base + blog_base + "/posts?" + "api_key=" + client_key +
                  "&notes_info=true&id=" + post_id)

    response, content = tumblr.request(request_url,"GET")

    if(response['status'] == "200"):
      info = json.loads(content)

      # Short cut
      post = info['response']['posts'][0]

      likes = 0
      reblogs = 0


      if('notes' in post):
        for note in post['notes']:
          if note['type'] == 'like':
            likes+=1
          elif note['type'] == 'reblog':
            reblogs+=1

      # because apparently tumblr can't garauntee the presence of all fields...
      ascot_url = ""
      if('source_url' in post):
        ascot_url = post['source_url']
      elif('link_url' in post):
        ascot_url = post['link_url']

      post_info.append({'poster': info['response']['blog']['name'],
                        'date_time': post['date'],
                        'tags': ','.join(post['tags']),
                        'likes': likes,
                        'reblogs': reblogs,
                        'ascot_url': ascot_url,
                        'tumblr_url': post["short_url"]})
      post_info_string = u''
      post_info_string = (info['response']['blog']['name'] +sep+
                          post['date'] +sep+
                          ','.join(post['tags']) +sep+
                          str(likes) +sep+
                          str(reblogs) +sep+
                          ascot_url +sep+
                          post["short_url"] + "\n")

      # Conver to ASCII and write out 
      # Note: this may result in some character loss in the tags but hopefully it won't matter
      report_file.writelines(post_info_string.encode('ascii', 'ignore'))

    else:
      error_str = "Errror with " + request_url
      print(error_str)
      log_file.writelines(error_str + "\n")



log_file.writelines(current_date.strftime('%Y-%m-%d %H:%M:%S') + ": Tracker finished\n\n")