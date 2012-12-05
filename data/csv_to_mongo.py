import sys
import os
import re

def readCsv(lines):
  ret = []
  for line in lines:
    line = line.strip().replace("&amp;", "")
    if line[-1:] == "|":
      line = line[:-1]

    sp = line.split("|")
    price = sp[3].replace(",", "")
    if price[0] == "$":
      price = price[1:]
    price = float(price)
    url = sp[4]
    search = []
    search.extend(sp[0].lower().split(" "))
    search.extend(sp[1].lower().split(" "))
    search.extend(sp[2].lower().split(" "))
    if "Not Find Data" in sp[2]:
      continue
    searchf = []
    for i in range(0, len(search)):
      search[i] = search[i].strip()
      search[i] = re.sub("^\\W+", "", search[i])
      search[i] = re.sub("\\W+$", "", search[i])
      if len(search[i]) > 0:
        searchf.append(search[i])
    ret.append({ "name" : sp[0].replace("?", ""), "price" : price, "buy" : url, "brand" : sp[1], "type" : sp[2], "search" : searchf })

  return ret

def save(datum):
  f = os.popen("mongo ascot", "w")
  f.write("db.products.save({ name : '%s', price : %s, buyLink : '%s', brand : '%s', type : '%s', search : %s });\n" % (datum["name"].replace('\'', '\\\''), datum["price"], datum["buy"].replace('\'', '\\\''), datum["brand"].replace('\'', '\\\''), datum["type"].replace('\'', '\\\''), datum["search"]))
  f.flush()
  f.close()

f = sys.argv[1]
lines = readCsv(open(f).readlines())
for line in lines:
  print line
  save(line)

