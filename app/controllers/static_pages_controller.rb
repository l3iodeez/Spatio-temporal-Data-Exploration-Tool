class StaticPagesController < ApplicationController
  def data
    render file: "static_pages/data.tsv", layout: false, content_type: 'text/plain' 
  end
end
