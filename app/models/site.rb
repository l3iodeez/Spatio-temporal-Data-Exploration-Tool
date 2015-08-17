class Site < ActiveRecord::Base
has_many :measurements
reverse_geocoded_by :latitude, :longitude do |obj,results|
  if geo = results.first
  	obj.address = geo.address.split(',')[0]
    obj.city    = geo.city
    obj.zip = geo.postal_code
    obj.state = geo.state_code

	end
end	

def self.as_csv
  CSV.generate do |csv|
    csv << column_names
    all.each do |item|
      csv << item.attributes.values_at(*column_names)
    end
  end
end


after_validation :reverse_geocode  # auto-fetch address
end
