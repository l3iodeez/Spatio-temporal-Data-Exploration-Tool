# frozen_string_literal: true

class StaticPagesController < ApplicationController
  before_action :authenticate_user!
  def root
    @current_user = current_user
  end
end
