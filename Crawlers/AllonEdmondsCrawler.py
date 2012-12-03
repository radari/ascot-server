#gets the source code for the url
def get_page(url):
  return urllib2.urlopen(url).read()
  
#pulls all the data off the source page
def pull_data(url):
  source = get_page(url)
  