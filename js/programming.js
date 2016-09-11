// Generated by CoffeeScript 1.10.0
(function() {
  var ctrl;

  window.editor = void 0;

  ctrl = false;

  this.runCode = function() {
    var data, to_disable;
    data = new FormData();
    data.append("language", $("#language").val());
    data.append("pid", $("#pid").val());
    data.append("program", window.editor.getValue());
    to_disable = "#upload_form input, #upload_form select";
    $(to_disable).attr("disabled", "disabled");
    return $.ajax({
      type: "POST",
      url: "/api/programming/run_code",
      dataType: "json",
      data: data,
      processData: false,
      contentType: false
    }).done(function(result) {
      var class_name;
      class_name = result.success === 1 ? "success" : "warning";
      display_message("#upload_msg", class_name, result.message, function() {
        if (result.success === 1) {
          $(to_disable).removeAttr("disabled");
          return fetch_submissions();
        }
      });
      if (result.success !== 1) {
        return $(to_disable).removeAttr("disabled");
      }
    });
  };

  this.handle_upload = function(e) {
    var data, file, to_disable;
    e.preventDefault();
    data = new FormData();
    file = (document.getElementById("file")).files[0];
    if (file && file.name) {
      data.append("file", file, file.name);
    }
    data.append("language", $("#language").val());
    data.append("pid", $("#pid").val());
    to_disable = "#upload_form input, #upload_form select";
    $(to_disable).attr("disabled", "disabled");
    return $.ajax({
      type: "POST",
      url: "/api/programming/upload",
      dataType: "json",
      data: data,
      processData: false,
      contentType: false
    }).done(function(result) {
      var class_name;
      class_name = result.success === 1 ? "success" : "warning";
      display_message("#upload_msg", class_name, result.message, function() {
        if (result.success === 1) {
          $(to_disable).removeAttr("disabled");
          return fetch_submissions();
        }
      });
      if (result.success !== 1) {
        return $(to_disable).removeAttr("disabled");
      }
    });
  };

  this.viewLog = function(token) {
    return api_call("GET", "/api/programming/stdout", {
      token: token
    }).done(function(result) {
      if (result.success === 1) {
        $("#stdoutModalLabel").html("Output for " + result.pid + " <small>" + ((new Date(result.timestamp * 1000)).toISOString()) + "</small>");
        $("#stdoutModalBody").html("<pre>" + result.data + "</pre>");
        return $('#stdoutModal').modal({});
      }
    });
  };

  this.fetch_problems = function() {
    return api_call("GET", "/api/problem/get_unlocked", {}).done(function(result) {
      var i, j, len, len1, name, names, namesOptions, problem, ref;
      if (result.success === 1) {
        names = [];
        ref = result.data;
        for (i = 0, len = ref.length; i < len; i++) {
          problem = ref[i];
          if (problem["programming"] === true) {
            names.push({
              pid: problem["pid"],
              title: problem["title"]
            });
          }
        }
        namesOptions = '';
        for (j = 0, len1 = names.length; j < len1; j++) {
          name = names[j];
          namesOptions += '<option value=\'' + name["pid"] + '\'>' + name["title"] + '</option>';
        }
        $('#pid').html(namesOptions);
        return $('#pid').selectpicker("refresh");
      }
    });
  };

  this.deleteRun = function(p_token) {
    if (confirm("Are you sure you want to remove this program? This action is irreversible.")) {
      return api_call("POST", "/api/programming/delete_run", {
        "p_token": p_token
      }).done(function(result) {
        if (result["success"] === 1) {
          return display_message("#rr" + token + " td", "success", result["message"], function() {
            return ($("#r" + token)).slideUp("fast");
          });
        } else {
          return display_message("#rr" + token + " td", "danger", result["message"]);
        }
      });
    }
  };

  this.fetch_submissions = function() {
    return api_call("GET", "/api/programming/all", {}).done(function(result) {
      var count, html, i, len, ref, row;
      if (result.success === 1) {
        html = "";
        count = result.data.length;
        ref = result.data;
        for (i = 0, len = ref.length; i < len; i++) {
          row = ref[i];
          html += "<tr id='rr" + row["token"] + "'><td colspan='5'></div></tr>";
          html += "<tr id='r" + row["token"] + "'>";
          html += "<td>" + '<div class=\'dropdown\'><a class=\'btn btn-default\' id=\'optbtn' + row['token'] + '\' data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" data-target="#">' + count + '</a><ul class=\'dropdown-menu\' aria-labelledby=\'optbtn' + row['token'] + '\'><li><a href=\'javascript:void(0);\' onclick=\'javascript:viewLog("' + row['token'] + '");\'><i class=\'fa fa-eye fa-fw\'></i> View Log</a></li><li><a href=\'javascript:void(0);\' onclick=\'javascript:deleteRun("' + row['token'] + '");\'><i class=\'fa fa-trash fa-fw\'></i> Remove This Run</a></li></ul></div>' + "</td>";
          html += "<td>" + (row["timestamp"] ? "<span class='timeago' title='" + ((new Date(row["timestamp"] * 1000)).toISOString()) + "'></span>" : "<img src='/images/loading.gif' />") + "</td>";
          html += "<td>" + (row["pid"] ? row["pid"] : "<img src='/images/loading.gif' />") + "</td>";
          html += "<td style='max-width:40vh;'>" + (row["message"] ? row["message"] : "<img src='/images/loading.gif' />") + "</td>";
          html += "<td>" + (row["flag"] ? "<span class='flag_hide'>" + row["flag"] + "</span>" : "<span class='no_flag'></span>") + "</td>";
          html += "</tr>";
          count -= 1;
        }
        $("#submissions_container").html(html);
        $(".flag_hide").each(function() {
          var flag;
          flag = $(this).html();
          flag = flag.replace("'", "\'");
          return $(this).html("<input type='password' class='form-control' value=\"" + flag + "\" onfocus=\"javascript:this.type='text';\" onblur=\"javascript:this.type='password';\" size='3' />");
        });
        $(".no_flag").each(function() {
          return $(this).html("<input type='password' class='form-control' size='3' placeholder='No flag!' disabled />");
        });
        $(".timeago").timeago();
        return 0;
      }
    });
  };

  this.loadCSS = function(path) {
    var link;
    link = document.createElement("link");
    link.href = path;
    link.type = "text/css";
    link.rel = "stylesheet";
    return (document.getElementsByTagName("head"))[0].appendChild(link);
  };

  $(function() {
    var si;
    redirect_if_not_logged_in(true);
    $("#upload_btn").on("click", handle_upload);
    fetch_problems();
    si = setInterval(fetch_submissions, 10000);
    fetch_submissions();
    window.editor = CodeMirror(document.getElementById("editor-container"), {
      mode: "python",
      theme: "eclipse",
      lineNumbers: true
    });
    $(document).keydown(function(e) {
      if (e.keyCode === 17) {
        ctrl = true;
      }
    });
    $(document).keyup(function(e) {
      if (e.keyCode === 13 && ctrl && window.editor.getValue().trim().length > 0) {
        runCode();
      } else if (e.keyCode === 17) {
        ctrl = false;
      }
    });
    return $("#theme").on("change", function(e) {
      var theme;
      theme = e.target.value;
      return window.editor.setOption("theme", theme);
    });
  });

}).call(this);
