# frozen_string_literal: true

module ApplicationHelper
  def json_handoff(key, value)
    <<-TEXT.html_safe
    <script>
      (function() {
        if (typeof(WP) === 'undefined') {
          WP = {};
        }
        var #{key} = #{ActiveSupport::JSON.encode(value)};
        WP.#{key} = #{key};
      })();
    </script>
    TEXT
  end
end
