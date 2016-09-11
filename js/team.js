// Generated by CoffeeScript 1.10.0
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(function() {
    var teamname;
    teamname = decodeURIComponent(location.search.substring(1));
    $(".teamname").html(htmlEntities(teamname));
    document.title = "Team " + teamname + " - EasyCTF 2015";
    return api_call("GET", "/api/team/public_info", {
      teamname: teamname
    }).done(function(result) {
      return $.getJSON("/api/stats/scoreboard").done(function(sc_result) {
        var category, html, i, j, k, l, len, len1, len2, len3, len4, m, member, newDate, problem, ref, ref1, ref2, scoreboard, solved, team, team_entry;
        if (result.success === 1 && sc_result.success === 1) {
          team = result.data;
          scoreboard = sc_result["data"]["scores"];
          for (i = 0, len = scoreboard.length; i < len; i++) {
            team_entry = scoreboard[i];
            if (team_entry["tid"] === team["tid"]) {
              team = merge_options(team, team_entry);
              break;
            }
          }
          console.log(team);
          if (team["school"]) {
            $("#school").html(team["school"]);
          }
          $("#num_members").html(team["members"].length);
          html = "<ul>";
          ref = team["members"];
          for (j = 0, len1 = ref.length; j < len1; j++) {
            member = ref[j];
            html += "<li><a href='/user?" + encodeURIComponent(member["username"]) + "'>" + htmlEntities(member["name"]) + "</a></li>";
          }
          html += "</ul>";
          $("#members").html(html);
          if (team["rank"]) {
            $("#rank").html(team["rank"]);
          }
          if (team["score"]) {
            $("#score").html(team["score"]);
          }
          if (team["points"] > 0 && indexOf.call(Object.keys(team), "category_breakdown") >= 0) {
            html = "";
            google.load("visualization", "1", {
              packages: ["corechart"],
              callback: function() {
                var chart, data, options;
                data = google.visualization.arrayToDataTable(result["data"]["score_progression"]["points"]);
                options = result["data"]["score_progression"]["options"];
                chart = new google.visualization.LineChart(document.getElementById("graph_container"));
                chart.draw(data, options);
                console.log("Done drawing graph.");
                return $("#graph_container").show("fast");
              }
            });
            solved = [];
            ref1 = Object.keys(team["category_breakdown"]);
            for (k = 0, len2 = ref1.length; k < len2; k++) {
              category = ref1[k];
              ref2 = team["category_breakdown"][category];
              for (l = 0, len3 = ref2.length; l < len3; l++) {
                problem = ref2[l];
                if (problem["solved"] === true) {
                  solved.push(problem);
                }
              }
            }
            solved.sort((function(x, y) {
              if (x["timestamp"] < y["timestamp"]) {
                return 1;
              }
              if (x["timestamp"] > y["timestamp"]) {
                return -1;
              }
              return 0;
            }));
            for (m = 0, len4 = solved.length; m < len4; m++) {
              problem = solved[m];
              newDate = new Date();
              newDate.setTime(problem["timestamp"] * 1000);
              html += "<tr>";
              html += "<td>" + problem["problem"] + "</td>";
              html += "<td>" + problem["category"] + "</td>";
              html += "<td>" + ((Math.round((parseFloat(problem["points"])) * 100)) / 100) + "</td>";
              html += "<td><span class='timeago' title='" + (newDate.toISOString()) + "'></span></td>";
              html += "</tr>";
            }
            $("#teaminfo_body").html(html);
            $(".timeago").timeago();
            $("#teaminfo_score").slideDown("fast");
            false;
          }
          return $("#teaminfo").slideDown("fast");
        } else {
          $("#comments_section").hide();
          return $("#error_1").slideDown("fast");
        }
      });
    });
  });

}).call(this);
