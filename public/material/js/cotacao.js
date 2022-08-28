$(document).ready(function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    //enviar dados cotação
    $("#form-import").submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "/cotacao/historico/",
            dataType: "json",
            data: $(this).serialize(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "bearer token",
                "accept": "application/json",
            },
            beforeSend: function () {
                // $("#btn-go").siblings(".help-block").html(loadingImg("Verificando..."));
            },
            success: function (response) {
                // clearErrors();
                var statusTrue, statusFalse, countTrue = 0, countFalse = 0;

                $.each(response, function (key, value) {
                    if (value.status) {
                        statusTrue = value.status;
                        countTrue++;
                    } else {
                        statusFalse = value.status;
                        countFalse++;
                    }
                });

                if (statusTrue) {
                    $("#cotacaoModal").modal("hide");

                    swal({
                        title: "Sucesso!",
                        text: "Cotação importada com sucesso! \n Total: " + countTrue,
                        type: "success"
                    },
                        function () {
                            location.reload(true);
                        }
                    );

                } else if (statusFalse == 'false') {
                    swal({
                        title: "Atenção!",
                        text: "Algumas contações não foram importadas. \n Total: " + countFalse,
                        type: "danger"
                    },
                        function () {
                            location.reload(true);
                        }
                    );
                }

            }
        })

        return false;
    });


    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(".btn-edit-cotacao").click(function () {

        $.ajax({
            type: "GET",
            url: "/cotacao/historico/" + $(this).attr("id"),
            dataType: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "bearer token",
                "accept": "application/json",
            },
            success: function (response) {

                $("#form-new")[0].reset();
                // $("#foto").attr("src", "");
                $("#cotacaoNew").modal();

                $.each(response.data, function (id, value) {
                    $("#" + id).val(value);
                });

                $(".form-group").addClass("is-focused");
                $(".selectpicker").selectpicker("refresh");

            }
        })
    });

    $(".btn-del-cotacao").click(function () {

        swal({
            title: "Atenção!",
            text: "Deseja deletar esse usuário ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d9534f",
            confirmButtonText: "Sim",
            cancelButtontext: "Não",
            closeOnConfirm: true,
            closeOnCancel: true,
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "DELETE",
                    url: "/cotacao/historico/" + $(this).attr("id"),
                    dataType: "json",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "bearer token",
                        "accept": "application/json",
                    },
                    success: function (response) {

                        swal({
                            title: "Sucesso!",
                            text: "Ação executada com sucesso.",
                            type: "success"
                        }).then(function () {
                            location.reload();
                        });

                    }
                })
            }
        })

    });

    $("#form-new").submit(function (e) {
        e.preventDefault();
        var id = $('#id').val();
        var typeHttp = 'PUT';

        if (id == '') {
            typeHttp = 'POST';
        }

        $.ajax({
            type: typeHttp,
            url: "/cotacao/historico/save/" + id,
            dataType: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "bearer token",
                "accept": "application/json",
            },
            data: $(this).serialize(),
            success: function (response) {
                console.log(response);
                if (response.status) {
                    swal({
                        title: "Sucesso!",
                        text: response.message,
                        type: "success"
                    }).then(function () {
                        $("#form-new")[0].reset();
                        $("#cotacaoNew").modal('hide');
                        location.reload();
                    });
                } else {
                    swal({
                        title: "Atenção!",
                        text: response.message,
                        type: "error"
                    }).then(function () {
                        // $("#cotacaoNew").modal('hide');
                        location.reload();
                    });
                }
            }
        })
        return false;
    });

});

