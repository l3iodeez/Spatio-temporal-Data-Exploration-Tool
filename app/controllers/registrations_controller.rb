# app/controllers/registrations_controller.rb
class RegistrationsController < Devise::RegistrationsController
  def new
    super
  end

  def create
    success = false
    user = User.find_for_authentication(email: params[:user][:email])
    success = true if user&.valid_password?(params[:user][:password])
    success = true  if user.nil? && valid_email(params[:user][:email])
    binding.pry
    if success
      sign_in(user)
      render json: { success: true, loggedIn: true, authToken: form_authenticity_token }
    else
      render json: { success: false, loggedIn: true, authToken: form_authenticity_token, errors: ['Login failed.'] }
    end
  end

  def update
    super
  end

  private

  def valid_email(email)
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.match(email)
  end
end
