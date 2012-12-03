import urllib2

#gets the source code for the url
def get_page(url):
  return urllib2.urlopen(url).read()

#locates the Men's section on the RL mainpage
def find_men(url):
  men_url = 'http://www.jcrew.com/mens-clothing.jsp'
  potato = get_page(men_url)
  return potato

#locates the specified category within the broad category- Men, Women, etc.
def find_category_link(url, product_type):
  source = get_page(url)
  polos = source.find('>' + product_type + '<')
  polos_link = source.find('href=', polos-160)
  start_quote = source.find('"', polos_link)
  end_quote = source.find('"', start_quote+1)
  polos_url = source[start_quote + 1:end_quote]
 # print "Found the category!"
  return polos_url

#creates a list of all category links
def list_all_categories(url):
 # print "Started list_all_categories"
  links = []
  categories = ['shirts', 'sweaters', 'tees, polos & fleece', 'pants', 'outerwear', 'suiting', 'sportcoats & vests', 'ties & pocket squares', 'underwear & sleepwear', 'shorts', 'swim', 'shoes', 'bags & accessories']
  men = find_men(url)
  for type in categories:
    links.append(find_category_link(men, type))
#  print "listed all the categories!"
  return links

#takes each of the product links within the page and turns them into a list
#uses get_next_target to actually find them.
def find_product_links(url):
  view_more = url + '?iNextCategory=-1'
  page = get_page(view_more)
  links = []
  while True:
    url,endpos = get_next_target(page)
    if url:
      links.append(url)
      page = page[endpos:]
    else:
      break
  return links
  
#used by find_product_links to find each product link and returns it
def get_next_target(source):
  prod = source.find('class="arrayProdName"')
  start_link = source.find('href=', prod)
  if start_link == -1:
    return None, 0
  start_quote = source.find('"', start_link)
  end_quote = source.find('"', start_quote + 1)
  prod_url = source[start_quote + 1:end_quote]
  return prod_url, end_quote
  
#finds the product name, style number, price, and sales price.
#If sales price is True, it returns sales price as "price."  Otherwise,
#it returns price as "price".
def extract_info(item_link):
  info = []
  source = get_page(item_link)
  name = locate_product_name(source)
#ID is currently unnecessary
#  ID = locate_product_style_number(source)
  price = locate_price(source)
  buy_link = item_link
  brand = "J Crew"
  type = locate_product_type(source)
  info.append(name)
  info.append(brand)
  info.append(type)
  info.append(price)
  info.append(buy_link)
 # print "Extracted info successfully"
  return info

#locate the product name
def locate_product_name(source):
  info = source.find('id="pdp-title"')
  h1 = source.find('<h1>', info)
  first_bracket = source.find('>', h1)
  second_bracket = source.find('<', first_bracket+1)
  product_name = source[first_bracket+1:second_bracket]
 # print "Located the product name"
  return product_name

def locate_product_type(source):
  meta = source.find('NAME=productattributes')
  family = source.find('family', meta)
  colon = source.find(':', family)
  other_thing = source.find('|', colon)
  type = source[colon+1:other_thing]
  type = type.strip()
  return type

#locate price of product
def locate_price(source):
  price_class = source.find('class="price-single"')
  first_bracket = source.find('>', price_class)
  second_bracket = source.find('<', first_bracket+1)
  product_price = source[first_bracket+1:second_bracket]
#remove random crap from string
  product_price = product_price.replace('$', '')
 # print "Located the price"
  return product_price

#creates an index of everything
def index_this_thang(url):
 # print "Index thang started properly"
  index = []
  list = list_all_categories(url)
  categories = ['shirts', 'sweaters', 'tees, polos & fleece', 'pants', 'outerwear', 'suiting', 'sportcoats & vests', 'ties & pocket squares', 'underwear & sleepwear', 'shorts', 'swim', 'shoes', 'bags & accessories']
  i = 0
  for link in list:
 #   print "Starting category index loop"
    product_pages = find_product_links(link)
    for page in product_pages:
#      print "Starting product index loop"
      information = extract_info(page)
      index.append([information[0], information [1], categories[i], information[2], information[3]])
    i = i+1
 #     print "Finished product index loop"
#    print "Finished category index loop"
  return index
  
#exports the index as a csv
def csv_writer(index):
  import csv
  #with open('database.csv', 'wb') as csvfile:
  #  spamwriter = csv.writer(csvfile, delimiter=',', quotechar = '|', quoting = csv.QUOTE_MINIMAL)
  #  spamwriter.writerow(index)
  for el in index:
    print "%s|%s|%s|%s|%s" % (el[0], el[1], el[2], el[3], el[4])

#index = [['Product name 1', 'Ralph Lauren', 'Price: 75', 'http://collegehumor.com'], ['Product name 2', 'Ralph Lauren', 'Price: 69', 'http://meatspin.com']]
index = index_this_thang('http://www.jcrew.com/index.jsp')
csv_writer(index)