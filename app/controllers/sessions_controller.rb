# frozen_string_literal: true

# app/controllers/sessions_controller.rb
class SessionsController < Devise::SessionsController
  def create
    user = User.find_for_authentication(email: params[:user][:email])

    if user&.valid_password?(params[:user][:password])
      sign_in(user)
      render json: { success: true }
    else
      render json: { success: false, errors: ['Login failed.'] }
    end
  end
end
