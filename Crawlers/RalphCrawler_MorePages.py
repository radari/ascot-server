import urllib2

#gets the source code for the url
def get_page(url):
  return urllib2.urlopen(url).read()

#locates the Men's section on the RL mainpage
def find_men(url):
  source = get_page(url)
  men = source.find('title="Men"')
  men_link = source.find('href=', men)
  start_quote = source.find('"', men_link)
  end_quote = source.find('"', start_quote+1)
  url = source[start_quote + 1:end_quote]
  men_url = "http://www.ralphlauren.com" + url
  print "Found Men!"
  return men_url

#def find_women(url):
#  source = get_page(url)
#  men = source.find('title="Women"')
 # men_link = source.find('href=', men)
 # start_quote = source.find('"', men_link)
 # end_quote = source.find('"', start_quote+1)
 # url = source[start_quote + 1:end_quote]
 # men_url = "http://www.ralphlauren.com" + url
  #print "Found Men!"
  #return men_url

#locates the specified category within the broad category- Men, Women, etc.
def find_category_link(url, product_type):
  source = get_page(url)
  polos = source.find(product_type)
  polos_link = source.find('href=', polos-120)
  start_quote = source.find('"', polos_link)
  end_quote = source.find('"', start_quote+1)
  url = source[start_quote + 1:end_quote]
  polos_url = "http://www.ralphlauren.com" + url
  print "Found the category!"
  return polos_url

def find_total_pages(url):
  source = get_page(url)
  total_pages = source.find('total-pages')
  first_bracket = source.find('>', total_pages)
  second_bracket = source.find('<', first_bracket)
  number_of_pages = source[first_bracket+1:second_bracket]
  return number_of_pages
  

#creates a list of all category links
def list_all_categories(url):
 # print "Started list_all_categories"
  links = []
  categories = ['Polos','Sport Shirts', 'Dress Shirts', 'Jackets & Outerwear', 'Sweaters', 'Sweatshirts & T-Shirts', 'Rugbys', 'Pants', 'Chinos', 'Jeans', 'Sport Coats', 'Suits', 'Formalwear', 'Shorts', 'Swim', 'Big & Tall', 'Underwear', 'Sleepwear & Robes', 'Socks', 'Shoes', 'Ties & Pocket Squares', 'Belts', 'Bags & Business', 'Small Leather Goods', 'Silver Accessories', 'Hats, Gloves & Scarves', 'Sunglasses']
  men = find_men(url)
  for type in categories:
    links.append([find_category_link(men, type), type])
  print "listed all the categories!"
  return links

#def list_all_women_categories(url):
#  links = []
#  categories = ['Polos', 'Shirts', 'Knits & Tees', 'Sweaters', 'Dresses', 'Skirts', 'Pants & Shorts', 'Denim', 'Jackets', 'Outerwear', 'Swim', 'Sleepwear', 'Hosiery']
#  men = find_men(url)
#  for type in categories:
#    links.append(find_category_link(men, type))
#  print "listed all the categories!"
#  return links

#takes each of the product links within the page and turns them into a list
#uses get_next_target to actually find them.
def find_product_links(url, type):
  categories_with_more_pages = ['Polos', 'Sport Shirts', 'Jackets & Outerwear', 'Sweaters', 'Sweatshirts & T-Shirts', 'Pants', 'Big & Tall', 'Shoes', 'Ties & Pocket Squares']
  view_more = url + '&view=99'
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
  prod = source.find('class="brand-link"')
  start_link = source.find('href=', prod)
  if start_link == -1:
    return None, 0
  start_quote = source.find('"', start_link)
  end_quote = source.find('"', start_quote + 1)
  url = source[start_quote + 1:end_quote]
  prod_url = "http://www.ralphlauren.com" + url
  return prod_url, end_quote
  
#finds the product name, style number, price, and sales price.
#If sales price is True, it returns sales price as "price."  Otherwise,
#it returns price as "price".
def extract_info(item_link):
  info = []
  source = get_page(item_link)
  name = locate_product_name(source)
#ID is currently unnecessary
 # ID = locate_product_style_number(source)
  price = locate_price(source)
  buy_link = item_link
  brand = "Ralph Lauren"
 # type = locate_product_type(source)
  info.append(name)
  info.append(brand)
  #info.append(type)
  info.append(price)
  info.append(buy_link)
  print "Extracted info successfully"
  return info

#locate the product name
def locate_product_name(source):
  info = source.find('class="prodtitleLG"')
  h1 = source.find('<h1>', info)
  first_bracket = source.find('>', h1)
  second_bracket = source.find('<', first_bracket+1)
  product_name = source[first_bracket+1:second_bracket]
 # print "Located the product name"
  return product_name

#locate product style number
def locate_product_style_number(source):
  style_class = source.find('class="productStyle"')
  first_bracket = source.find('>', style_class)
  second_bracket = source.find('<', first_bracket+1)
  product_style_number = source[first_bracket+1:second_bracket]
  #print "Located the style number"
  return product_style_number

def locate_product_type(source):
  title = source.find('<title>')
  semi_colon = source.find(';', title)
 # colon = source.find(':', family)
  dash = source.find('-', semi_colon)
  type = source[semi_colon+2:dash-1]
  return type

#locate price of product
def locate_price(source):
  price_class = source.find('class="prodourprice"')
  first_bracket = source.find('>', price_class)
  second_bracket = source.find('<', first_bracket+1)
  product_price = source[first_bracket+1:second_bracket]
#remove random crap from string
  product_price = product_price.replace('&#036;', '')
  product_price = product_price.replace('Price: ', '')
 # print "Located the price"
  return product_price

#creates an index of everything
def index_this_thang(url):
  print "Index thang started properly"
  index = []
  list = list_all_categories(url)
  for link in list:
    print "Starting category index loop"
    product_pages = find_product_links(link[0], link[1])
    for page in product_pages:
      print "Starting product index loop"
      information = extract_info(page)
      index.append([information[0], information [1], link[1], information[2], information[3]])
      print "Finished product index loop"
    print "Finished category index loop"
  return index

#def index_this_thang_with_women(url):
 # print "Index thang started properly"
  #index = []
  #list = list_all_categories(url) + list_all_women_categories(url)
  #for link in list:
  #  print "Starting category index loop"
  #  product_pages = find_product_links(link)
  #  for page in product_pages:
  #    print "Starting product index loop"
  #    information = extract_info(page)
  #    index.append([information[0], information [1], information[2], information[3]])
  #    print "Finished product index loop"
  #  print "Finished category index loop"
  #return index
  
#exports the index as a csv
def csv_writer(index):
  import csv
  #with open('database.csv', 'wb') as csvfile:
  #  spamwriter = csv.writer(csvfile, delimiter=',', quotechar = '|', quoting = csv.QUOTE_MINIMAL)
  #  spamwriter.writerow(index)
  for el in index:
    print "%s|%s|%s|%s|%s" % (el[0], el[1], el[2], el[3], el[4])

#index = [['Product name 1', 'Ralph Lauren', 'Price: 75', 'http://collegehumor.com'], ['Product name 2', 'Ralph Lauren', 'Price: 69', 'http://meatspin.com']]
index = index_this_thang('http://www.ralphlauren.com/home/index.jsp?ab=int_fd_background')
csv_writer(index)