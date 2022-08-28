@extends('layouts.app', ['activePage' => 'dashboard', 'titlePage' => __('Dashboard')])

@section('content')
<div class="content">
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="card card-stats">
          <div class="card-header card-header-warning card-header-icon">
            <div class="card-icon">
              <i class="material-icons">attach_money</i>
            </div>

            <p class="card-category" id="usdbrl">
            </p>
          </div>
          <div class="card-footer">
            <div class="stats" id="usdbrl-s">

            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="card card-stats">
          <div class="card-header card-header-rose card-header-icon">
            <div class="card-icon">
              <i class="material-icons">euro_symbol</i>
            </div>
            <p class="card-category" id="eurbrl"></p>
          </div>
          <div class="card-footer">
            <div class="stats" id="eurbrl-s">

            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="card card-stats">
          <div class="card-header card-header-success card-header-icon">
            <div class="card-icon">
              <i class="material-icons">currency_bitcoin</i>
            </div>
            <p class="card-category" id="btcbrl"></p>
          </div>
          <div class="card-footer">
            <div class="stats" id="btcbrl-s">

            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="card card-stats">
          <div class="card-header card-header-info card-header-icon">
            <div class="card-icon">
              <i class="material-icons">attach_money</i>
            </div>
            <p class="card-category" id="ethbrl"></p>
          </div>
          <div class="card-footer">
            <div class="stats" id="ethbrl-s">

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="card ">
          <div class="card-header card-header-success card-header-icon">
            <div class="card-icon">
              <i class="material-icons"></i>
            </div>
            <h4 class="card-title">Global Sales by Top Locations</h4>
          </div>
          <div class="card-body ">
            <div class="row">
              <div class="col-md-6">
                <div class="table-responsive table-sales">
                  <table class="table">
                    <tbody>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="{{asset('material')}}/img/flags/US.png">
                          </div>
                        </td>
                        <td>USA</td>
                        <td class="text-right">
                          2.920
                        </td>
                        <td class="text-right">
                          53.23%
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="{{asset('material')}}/img/flags/DE.png">
                          </div>
                        </td>
                        <td>Germany</td>
                        <td class="text-right">
                          1.300
                        </td>
                        <td class="text-right">
                          20.43%
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="{{asset('material')}}/img/flags/AU.png">
                          </div>
                        </td>
                        <td>Australia</td>
                        <td class="text-right">
                          760
                        </td>
                        <td class="text-right">
                          10.35%
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="{{asset('material')}}/img/flags/GB.png">
                          </div>
                        </td>
                        <td>United Kingdom</td>
                        <td class="text-right">
                          690
                        </td>
                        <td class="text-right">
                          7.87%
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="{{asset('material')}}/img/flags/RO.png">
                          </div>
                        </td>
                        <td>Romania</td>
                        <td class="text-right">
                          600
                        </td>
                        <td class="text-right">
                          5.94%
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flag">
                            <img src="{{asset('material')}}/img/flags/BR.png">
                          </div>
                        </td>
                        <td>Brasil</td>
                        <td class="text-right">
                          550
                        </td>
                        <td class="text-right">
                          4.34%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="col-md-6 ml-auto mr-auto">
                <div id="worldMap" style="height: 300px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="card card-chart">
          <div class="card-header card-header-rose" data-header-animation="true">
            <div class="ct-chart" id="websiteViewsChart"></div>
          </div>
          <div class="card-body">
            <div class="card-actions">
              <button type="button" class="btn btn-danger btn-link fix-broken-card">
                <i class="material-icons">build</i> Fix Header!
              </button>
              <button type="button" class="btn btn-info btn-link" rel="tooltip" data-placement="bottom" title="Refresh">
                <i class="material-icons">refresh</i>
              </button>
              <button type="button" class="btn btn-default btn-link" rel="tooltip" data-placement="bottom" title="Change Date">
                <i class="material-icons">edit</i>
              </button>
            </div>
            <h4 class="card-title">Website Views</h4>
            <p class="card-category">Last Campaign Performance</p>
          </div>
          <div class="card-footer">
            <div class="stats">
              <i class="material-icons">access_time</i> campaign sent 2 days ago
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card card-chart">
          <div class="card-header card-header-success" data-header-animation="true">
            <div class="ct-chart" id="dailySalesChart"></div>
          </div>
          <div class="card-body">
            <div class="card-actions">
              <button type="button" class="btn btn-danger btn-link fix-broken-card">
                <i class="material-icons">build</i> Fix Header!
              </button>
              <button type="button" class="btn btn-info btn-link" rel="tooltip" data-placement="bottom" title="Refresh">
                <i class="material-icons">refresh</i>
              </button>
              <button type="button" class="btn btn-default btn-link" rel="tooltip" data-placement="bottom" title="Change Date">
                <i class="material-icons">edit</i>
              </button>
            </div>
            <h4 class="card-title">Daily Sales</h4>
            <p class="card-category">
              <span class="text-success"><i class="fa fa-long-arrow-up"></i> 55% </span> increase in today sales.
            </p>
          </div>
          <div class="card-footer">
            <div class="stats">
              <i class="material-icons">access_time</i> updated 4 minutes ago
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card card-chart">
          <div class="card-header card-header-info" data-header-animation="true">
            <div class="ct-chart" id="completedTasksChart"></div>
          </div>
          <div class="card-body">
            <div class="card-actions">
              <button type="button" class="btn btn-danger btn-link fix-broken-card">
                <i class="material-icons">build</i> Fix Header!
              </button>
              <button type="button" class="btn btn-info btn-link" rel="tooltip" data-placement="bottom" title="Refresh">
                <i class="material-icons">refresh</i>
              </button>
              <button type="button" class="btn btn-default btn-link" rel="tooltip" data-placement="bottom" title="Change Date">
                <i class="material-icons">edit</i>
              </button>
            </div>
            <h4 class="card-title">Completed Tasks</h4>
            <p class="card-category">Last Campaign Performance</p>
          </div>
          <div class="card-footer">
            <div class="stats">
              <i class="material-icons">access_time</i> campaign sent 2 days ago
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</div>
@endsection

@push('js')
<script>
  $(document).ready(function() {
    $().ready(function() {
      $sidebar = $('.sidebar');

      $sidebar_img_container = $sidebar.find('.sidebar-background');

      $full_page = $('.full-page');

      $sidebar_responsive = $('body > .navbar-collapse');

      window_width = $(window).width();

      fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();

      if (window_width > 767 && fixed_plugin_open == 'Dashboard') {
        if ($('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
          $('.fixed-plugin .dropdown').addClass('open');
        }

      }

      $('.fixed-plugin a').click(function(event) {
        // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
        if ($(this).hasClass('switch-trigger')) {
          if (event.stopPropagation) {
            event.stopPropagation();
          } else if (window.event) {
            window.event.cancelBubble = true;
          }
        }
      });

      $('.fixed-plugin .active-color span').click(function() {
        $full_page_background = $('.full-page-background');

        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        var new_color = $(this).data('color');

        if ($sidebar.length != 0) {
          $sidebar.attr('data-color', new_color);
        }

        if ($full_page.length != 0) {
          $full_page.attr('filter-color', new_color);
        }

        if ($sidebar_responsive.length != 0) {
          $sidebar_responsive.attr('data-color', new_color);
        }
      });

      $('.fixed-plugin .background-color .badge').click(function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        var new_color = $(this).data('background-color');

        if ($sidebar.length != 0) {
          $sidebar.attr('data-background-color', new_color);
        }
      });

      $('.fixed-plugin .img-holder').click(function() {
        $full_page_background = $('.full-page-background');

        $(this).parent('li').siblings().removeClass('active');
        $(this).parent('li').addClass('active');


        var new_image = $(this).find("img").attr('src');

        if ($sidebar_img_container.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
          $sidebar_img_container.fadeOut('fast', function() {
            $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
            $sidebar_img_container.fadeIn('fast');
          });
        }

        if ($full_page_background.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
          var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

          $full_page_background.fadeOut('fast', function() {
            $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
            $full_page_background.fadeIn('fast');
          });
        }

        if ($('.switch-sidebar-image input:checked').length == 0) {
          var new_image = $('.fixed-plugin li.active .img-holder').find("img").attr('src');
          var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

          $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
          $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
        }

        if ($sidebar_responsive.length != 0) {
          $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
        }
      });

      $('.switch-sidebar-image input').change(function() {
        $full_page_background = $('.full-page-background');

        $input = $(this);

        if ($input.is(':checked')) {
          if ($sidebar_img_container.length != 0) {
            $sidebar_img_container.fadeIn('fast');
            $sidebar.attr('data-image', '#');
          }

          if ($full_page_background.length != 0) {
            $full_page_background.fadeIn('fast');
            $full_page.attr('data-image', '#');
          }

          background_image = true;
        } else {
          if ($sidebar_img_container.length != 0) {
            $sidebar.removeAttr('data-image');
            $sidebar_img_container.fadeOut('fast');
          }

          if ($full_page_background.length != 0) {
            $full_page.removeAttr('data-image', '#');
            $full_page_background.fadeOut('fast');
          }

          background_image = false;
        }
      });

      $('.switch-sidebar-mini input').change(function() {
        $body = $('body');

        $input = $(this);

        if (md.misc.sidebar_mini_active == true) {
          $('body').removeClass('sidebar-mini');
          md.misc.sidebar_mini_active = false;

          $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

        } else {

          $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar('destroy');

          setTimeout(function() {
            $('body').addClass('sidebar-mini');

            md.misc.sidebar_mini_active = true;
          }, 300);
        }

        // we simulate the window Resize so the charts will get updated in realtime.
        var simulateWindowResize = setInterval(function() {
          window.dispatchEvent(new Event('resize'));
        }, 180);

        // we stop the simulation of Window Resize after the animations are completed
        setTimeout(function() {
          clearInterval(simulateWindowResize);
        }, 1000);

      });
    });
  });
</script>
<script>
  function lastCoin() {
    $.ajax({
      type: "POST",
      url: "/cotacao/lastcoin/",
      dataType: "json",
      data: {
        "cotacao": "USD-BRL,EUR-BRL,BTC-BRL,ETH-BRL"
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "bearer token",
        "accept": "application/json",
      },
      beforeSend: function() {
        // $(".").siblings(".help-block").html(loadingImg("Verificando..."));
      },
      success: function(response) {

        $("#usdbrl").append(response.USDBRL.name + '<br> <h3 class = "card-title">' +
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(response.USDBRL.bid));

        $("#usdbrl-s").append('<i class="material-icons ">date_range</i> ' + response.USDBRL.create_date);

        $("#eurbrl").append(response.EURBRL.name + '<br> <h3 class = "card-title">' +
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(response.EURBRL.bid));

        $("#eurbrl-s").append('<i class="material-icons ">date_range</i> ' + response.EURBRL.create_date);

        $("#btcbrl").append(response.BTCBRL.name + '<br> <h3 class = "card-title">' +
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(response.BTCBRL.bid));

        $("#btcbrl-s").append('<i class="material-icons ">date_range</i> ' + response.BTCBRL.create_date);

        $("#ethbrl").append(response.ETHBRL.name + '<br> <h3 class = "card-title">' +
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(response.ETHBRL.bid));

        $("#ethbrl-s").append('<i class="material-icons ">date_range</i> ' + response.ETHBRL.create_date);
        console.log(response.ETHBRL);
      }
    });
  }

  function cardCotacao(dados) {


  }

  $(document).ready(function() {
    // Javascript method's body can be found in assets/js/demos.js
    md.initDashboardPageCharts();

    md.initVectorMap();

    lastCoin();

    setInterval(function() {
      $('#usdbrl').html("");
      $('#eurbrl').html("");
      $('#btcbrl').html("");
      $('#ethbrl').html("");
      $('#usdbrl-s').html("");
      $('#eurbrl-s').html("");
      $('#btcbrl-s').html("");
      $('#ethbrl-s').html("");
      lastCoin();
    }, 30000);

  });
</script>
@endpush