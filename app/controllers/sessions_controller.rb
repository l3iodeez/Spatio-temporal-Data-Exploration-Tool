# frozen_string_literal: true

# app/controllers/sessions_controller.rb
class SessionsController < Devise::SessionsController

  def create
    binding.pry
    super
  end
  def sign_in_and_redirect(resource_or_scope, resource = nil)
    scope = Devise::Mapping.find_scope!(resource_or_scope)
    resource ||= resource_or_scope
    sign_in(scope, resource) unless warden.user(scope) == resource
    render json: { success: true }
  end

  def failure
    render json: { success: false, errors: ['Login failed.'] }
  end
end
