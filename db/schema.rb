# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_12_12_193422) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "measurements", id: :serial, force: :cascade do |t|
    t.integer "site_id"
    t.string "site_name"
    t.date "measure_date"
    t.decimal "level"
    t.string "units"
    t.string "measure_type"
    t.string "data_provider"
    t.json "full_json"
  end

  create_table "saved_selections", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.json "site_ids"
    t.index ["user_id"], name: "index_saved_selections_on_user_id"
  end

  create_table "sites", id: :serial, force: :cascade do |t|
    t.string "site_name"
    t.string "well_reference"
    t.float "latitude"
    t.float "longitude"
    t.datetime "start"
    t.datetime "end"
    t.integer "measure_count"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "address"
    t.json "full_json"
    t.index ["site_name"], name: "index_sites_on_site_name", unique: true
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "saved_selections", "users"
end
