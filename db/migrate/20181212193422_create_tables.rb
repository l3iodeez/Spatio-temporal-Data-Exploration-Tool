class CreateTables < ActiveRecord::Migration
  def change
    create_table "measurements", force: :cascade do |t|
      t.integer "site_id"
      t.string  "site_name"
      t.date    "measure_date"
      t.decimal "level"
      t.string  "units"
      t.string  "measure_type"
      t.string  "data_provider"
    end

    create_table "saved_selections", force: :cascade do |t|
      t.integer "user_id"
      t.string  "name"
      t.json    "site_ids"
    end

    add_index "saved_selections", ["user_id"], name: "index_saved_selections_on_user_id", using: :btree

    create_table "sites", force: :cascade do |t|
      t.string   "agency"
      t.bigint  "site_number", :unique => true
      t.string   "site_name"
      t.string   "site_type"
      t.float    "latitude"
      t.float    "longitude"
      t.string    "coordinate_accuracy"
      t.string    "coordinate_datum"
      t.string    "altitude"
      t.string    "altitude_accuracy"
      t.string    "altitude_datum"
      t.string    "hydrologic_unit_code"
      t.string    "data_type"
      t.string    "parameter_code"
      t.string    "statistical_code"
      t.string    "timeseries_id"
      t.string    "measurement_description"
      t.string    "medium_group_code"
      t.string    "parameter_group_code"
      t.string    "srs_id"
      t.string    "access_code"
      t.datetime "start_date"
      t.datetime "end_date"
      t.integer  "measure_count"
      t.string   "address"
      t.string   "city"
      t.string   "state"
      t.string   "zip"
    end

    create_table "users", force: :cascade do |t|
      t.string   "email",                  default: "", null: false
      t.string   "encrypted_password",     default: "", null: false
      t.string   "reset_password_token"
      t.datetime "reset_password_sent_at"
      t.datetime "remember_created_at"
      t.integer  "sign_in_count",          default: 0,  null: false
      t.datetime "current_sign_in_at"
      t.datetime "last_sign_in_at"
      t.inet     "current_sign_in_ip"
      t.inet     "last_sign_in_ip"
      t.datetime "created_at",                          null: false
      t.datetime "updated_at",                          null: false
    end

    add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
    add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

    add_foreign_key "saved_selections", "users"
  end
end
