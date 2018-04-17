# frozen_string_literal: true

class StaticPagesController < ApplicationController
  def data
    render file: 'static_pages/data.tsv', layout: false, content_type: 'text/plain'
  end

  def usd_euro
    render file: 'static_pages/usd_euro.csv', layout: false, content_type: 'text/plain'
  end
end
