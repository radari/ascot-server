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

report_file = open("report.tsv", "w")
config_file = open("tumblr_posts.txt")


sep = "\t"
current_date = datetime.now()

# array of dictionaries containing the info about each post retrieved
# will allow entries to be sorted in the future
post_info = []

report_file.writelines("Current Date" + sep + current_date.ctime() + "\n")
report_file.writelines("Poster"+sep+
            "Date Time Posted"+sep+
            "Tags"+sep+
            "Likes"+sep+
            "Reblogs"+sep+
            "Followers at Time"+sep+
            "Ascot Link" +sep+
            "Tumblr Link\n")



tumblr_blogs = config_file.read().strip().split('#')
tumblr_blogs.remove('')
for blog in tumblr_blogs:
  post_list = blog.strip().split()
  blog_base = post_list.pop(0).strip()

  print blog_base
  print post_list

  for post_id in post_list:
    request_url = (tumblr_base + blog_base + "/posts?" + "api_key=" + client_key +
                  "&notes_info=true&id=" + post_id)

    response, content = tumblr.request(request_url,"GET")

    if(response['status'] == "200"):
      info = json.loads(content)

      # Short cut
      post = info['response']['posts'][0]
      print(info['response']['blog']['name'] + " " + str(info['response']['blog']['likes']))
      likes = 0
      reblogs = 0
      blog_followers = "NILL"


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
                        'followers': blog_followers,
                        'ascot_url': ascot_url,
                        'tumblr_url': post["short_url"]})


      post_info_string = (info['response']['blog']['name'] +sep+
                          post['date'] +sep+
                          ','.join(post['tags']) +sep+
                          str(likes) +sep+
                          str(reblogs) +sep+
                          blog_followers +sep+
                          ascot_url +sep+
                          post["short_url"] + "\n")

      report_file.writelines(post_info_string)

    else:
      error_str = current_date + " Errror with " + request_url
      print(error_str)
      report_file.writelines(error_str + "\n")



