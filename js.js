$(document).ready(function(){   


	$(document).on("click", "#goButton", function () { 
	
				var to = $("#to").val();
				var from = $("#from").val();
				var amount = $("#amount").val();
				
					$("#finalResult").empty();
				
							
				$.ajax({
			
					type: "POST",
					cache:false,
					data: {"from" : from,"to" : to, "amount" : amount},
					    
					url: "api/convert.php",
					dataType:"json",
					success: function(res){
						if(res != null){

						$("#finalResult").append(res);
                       

                        


					   }else{
                            console.log(res);
					   }
			
						
					
			
					},
					error: function(res){
				
						console.log("Error "+res);
					}
			
				}); 







		
		
		
		
	});


});
