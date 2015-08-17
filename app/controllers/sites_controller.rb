class SitesController < ApplicationController
  before_action :set_site, only: [:show, :edit, :update, :destroy]

  # GET /sites
  # GET /sites.json
  def index

 @sites = Site.all
      @hash = Gmaps4rails.build_markers(@sites) do |site, marker|
        site_link = view_context.link_to site.id.to_s, site_path(site.id)
      if site.measure_count
        marker.lat site.latitude
        marker.lng site.longitude
        marker.infowindow("<h4><u>#{site_link}</u></h4> ")
      end
    end

  end



def geocode_all
      @sites = Site.all
        count = 0
    @sites.each do |site|
      if not site.address
      site.update({:id => site.id})
      count += 1
        if count > 2 
          sleep(2)
          count = 0
        end
      end
    end
    respond_to do |format|
      format.html { redirect_to sites_url, notice: 'Sites have been successfully geocoded.' }
      format.json { head :no_content }
    end
end
  # GET /sites/1
  # GET /sites/1.json
  def show
     @sites = Site.near("#{@site.address} #{@site.city}, #{@site.state}",10) #Site.where("state = 'NJ' and measure_count > 1000")
      @hash = Gmaps4rails.build_markers(@sites) do |site, marker|
      if site.measure_count
        site_link = view_context.link_to site.id.to_s, site_path(site.id)
        marker.lat site.latitude
        marker.lng site.longitude
        #marker.json({ link: site_path(@site.id) })
       marker.infowindow("<h4><u>#{site_link}</u></h4> ")
      end
    end
  end

  # GET /sites/new
  def new

  #  @site = Site.new
  end

  # GET /sites/1/edit
  def edit
  end

  # POST /sites
  # POST /sites.json
  def create
   # @site = Site.new(site_params)

    #respond_to do |format|
    #  if @site.save
    #    format.html { redirect_to @site, notice: 'Site was successfully created.' }
    #    format.json { render :show, status: :created, location: @site }
    #  else
    #    format.html { render :new }
    #    format.json { render json: @site.errors, status: :unprocessable_entity }
    #  end
    #end
  end

  # PATCH/PUT /sites/1
  # PATCH/PUT /sites/1.json
  def update
  #  respond_to do |format|
  #    if @site.update(site_params)
  #      format.html { redirect_to @site, notice: 'Site was successfully updated.' }
  #      format.json { render :show, status: :ok, location: @site }
  #    else
  #      format.html { render :edit }
  #      format.json { render json: @site.errors, status: :unprocessable_entity }
  #    end
  #  end
  end

  # DELETE /sites/1
  # DELETE /sites/1.json
  def destroy
  #  @site.destroy
  #  respond_to do |format|
  #    format.html { redirect_to sites_url, notice: 'Site was successfully destroyed.' }
  #    format.json { head :no_content }
  #  end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_site
      @site = Site.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def site_params
      params.require(:site).permit(:city, :state, :zip, :measure_count)
    end
end
