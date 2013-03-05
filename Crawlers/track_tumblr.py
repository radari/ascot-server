import httplib2


# Create your consumer with the proper key/secret.
client_key="Wd7R7xxTHAtL0rTfEnmsgQhAZESE4aTz5tTbEPzpXZIMHvFKe0"


#request_token_url = "http://www.tumblr.com/oauth/request_token"


tumblr_base = "http://api.tumblr.com/v2/blog/"
cesar_base = "deverseli800.tumblr.com"

h = httplib2.Http(".cache")


request_url = tumblr_base + cesar_base + "/posts/text" + "?id=44549246300" + "&api_key=" + client_key

print request_url

resp, content = h.request(request_url,"GET")

print resp
print content




