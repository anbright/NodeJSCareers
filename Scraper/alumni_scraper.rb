require 'nokogiri'
require 'csv'

def scrape_file(filename)
	results = File.open(filename) { |f| Nokogiri::HTML(f) }
	profiles = results.css('.profileresult')
	alumni = Array.new

	profiles.each do |profile|
		text = profile.css('.single').text
		split_text = text.split(/\n\t\t\t/)
		split_text_cleaned = Array.new
		split_text.each {|e| split_text_cleaned << e.strip()}
		alumni << split_text_cleaned
	end

	alumni
end

def gen_csv(results, name)
	CSV.open(name, "w") do |csv|
		results.each do |row|
			csv << row
		end
	end
end

def scrape_alumni

	results = Array.new

	results.concat scrape_file("finance.html")
	results.concat scrape_file("consulting.html")
	results.concat scrape_file("accounting.html")
	results.concat scrape_file("biotechnology.html")
	results.concat scrape_file("computerit.html")
	results.concat scrape_file("entrepreneurial.html")
	results.concat scrape_file("healthcare.html")

	results.concat scrape_file("aerospace.html")
	results.concat scrape_file("architecture.html")
	results.concat scrape_file("chemical.html")
	results.concat scrape_file("dental.html")
	results.concat scrape_file("construction.html")
	results.concat scrape_file("hedgefund.html")
	results.concat scrape_file("hr.html")
	results.concat scrape_file("food.html")

	results.concat scrape_file("television.html")
	results.concat scrape_file("sports.html")
	results.concat scrape_file("retail.html")
	results.concat scrape_file("realestate.html")
	results.concat scrape_file("law.html")
	results.concat scrape_file("vc.html")

	gen_csv(results.uniq, "alumni_results.csv")

end

def scrape_pennlink(filename)
	results = File.open(filename) { |f| Nokogiri::HTML(f) }
	jobs = results.css('.list-item-body')

	jobs_array = Array.new

	jobs.each do |job|
		details = job.text.split(/^[a-zA-Z0-9_ ]*$/)
		new_details = Array.new
		details.each { |e| new_details << e.strip}
		company = new_details[4].split('-')[0].strip
		jobs_array << [new_details[1], new_details[3], company]
	end

	jobs_array
end

def scrape_all_pennlink

	results = Array.new

	results.concat scrape_pennlink("pennlink1.html")
	results.concat scrape_pennlink("pennlink2.html")
	results.concat scrape_pennlink("pennlink3.html")
	results.concat scrape_pennlink("pennlink4.html")
	results.concat scrape_pennlink("pennlink5.html")
	results.concat scrape_pennlink("pennlink6.html")
	results.concat scrape_pennlink("pennlink7.html")
	results.concat scrape_pennlink("pennlink8.html")

	gen_csv(results.uniq, "pennlinkresults.csv")

end

scrape_all_pennlink
scrape_alumni