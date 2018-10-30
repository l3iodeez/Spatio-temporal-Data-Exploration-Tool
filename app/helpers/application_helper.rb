# frozen_string_literal: true

module ApplicationHelper
  def json_handoff(key, value)
    <<-TEXT.html_safe
    <script>
      (function() {
        if (typeof(DP) === 'undefined') {
          DP = {};
        }
        var #{key} = #{ActiveSupport::JSON.encode(value)};
        DP.#{key} = #{key};
      })();
    </script>
    TEXT
  end
end
