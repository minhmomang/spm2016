var page= 1;
var recordperpage = 9;
var total_page = 0;
var _ismobile = ismobile();
$(function(){
	
	exe_load_header_search(function(out){
		if(out==true){	
			if(!isPc()){
				recordperpage=6;
				$("#record_page").val("6");
			}
			get_page();
		}		
	});
	$("#firstpage").click(function(){
		page=1;
		get_page();
	});
	$("#nextpage").click(function(){
		page+=1;
		get_page();
	});
	$("#prevpage").click(function(){
		page-=1;
		get_page();
	});	
	$("#lastpage").click(function(){
		page=total_page;
		get_page();
	});
	$("#nextpage").click(function(){
		page+=1;
		get_page();
	});
	$("#prevpage").click(function(){
		page-=1;
		get_page();
	});	
	$("#record_page").change(function(){		
		page = 1;
		recordperpage = $("#record_page").val();
		get_page();
	});
	
	
	
});
function load_text(callback){
	var url = ReturnHosing_apache()+'txt/product2.txt';
	$.get(url,function(data){
		callback(true,data);
	});
}
function load_text2(callback){
	var url = ReturnHosing_apache()+'txt/product3.txt';
	$.get(url,function(data){
		callback(true,data);
	});
}
function load_page(){	
	
	if(page==total_page)	{
		$("#firstpage").css('display','block');
		$("#prevpage").css('display','block');
		$("#nextpage").css('display','none');
		$("#lastpage").css('display','none');
	}
	if(page!=total_page)	{
		$("#firstpage").css('display','block');
		$("#prevpage").css('display','block');
		$("#nextpage").css('display','block');
		$("#lastpage").css('display','block');
	}
	if(page==1){
		$("#firstpage").css('display','none');
		$("#prevpage").css('display','none');
		$("#nextpage").css('display','block');
		$("#lastpage").css('display','block');
	}
	if(total_page==1){
		$("#firstpage").css('display','none');
		$("#prevpage").css('display','none');
		$("#nextpage").css('display','none');
		$("#lastpage").css('display','none');
	}
	
	$("#contentpaging").text('');
	if(total_page<=7){
		pageing(1,total_page);
	}
	else{
		if(page<5){
			pageing(1,7);
		}
		else{
			if(page+7<=total_page){
				var start = page-5;
				if(start<=0){
					start = 1;
				}
				var start1 = page-2;				
				var middle = page;
				var end = middle + 5;
				if(end>total_page){
					end = total_page;
				}
				var end1 = middle+ 3;
				split_pageing(start,start1,middle,end,end1);
			}
			else{
				pageing(total_page-6,total_page);
			}
		}
	}	
	
}
function pageing(start,n){		
	for(var i=start;i<=n;i++){
		var str1 = '<li><a style="@style" >@page</a></li>';
		var str2 = '<li><a style="@style" href="@href" onclick="@onclick">@page</a></li>';
		var str = '';
		if(i==page){
			str = str1;
			str = str.replace("@style",'text-decoration: underline;color: black;background-color: white;');
		}
		else{
			str = str2;
			str = str.replace("@href",'javascript:void(0)');
			str = str.replace("@onclick","javascript:viewpage("+i+");");
		}
		str = str.replace('@page',i);				
		$("#contentpaging").append(str).show();	
	}
}
function split_pageing(start,start1,middle,end,end1){		
	for(var i=start;i<start1;i++){		
		var str2 = '<li><a style="@style" href="@href" onclick="@onclick">@page</a></li>';
		var str = '';
		str = str2;
		str = str.replace("@href",'javascript:void(0)');
		str = str.replace("@onclick","javascript:viewpage("+i+");");
		str = str.replace('@page',i);				
		$("#contentpaging").append(str).show();	
	}
	//
	for(var i=0;i<3;i++){
		var str1 = '<li><a style="@style" >@page</a></li>';
		var str = ''
		switch (i) {
		case 0:
			str = str1.replace("@style",'text-decoration: underline;color: black;background-color: white;');
			str = str.replace('@page','...');
			break;
		case 1:
			str = str1.replace("@style",'text-decoration: underline;color: black;background-color: white;');
			str = str.replace('@page',middle);
			break;
		case 2:
			str = str1.replace("@style",'text-decoration: underline;color: black;background-color: white;');
			str = str.replace('@page','...');
			break;
		default:
			break;
		}
		$("#contentpaging").append(str).show();
	}
	//
	for(var i=end1;i<=end;i++){		
		var str2 = '<li><a style="@style" href="@href" onclick="@onclick">@page</a></li>';
		var str = '';
		str = str2;
		str = str.replace("@href",'javascript:void(0)');
		str = str.replace("@onclick","javascript:viewpage("+i+");");
		str = str.replace('@page',i);				
		$("#contentpaging").append(str).show();	
	}
}
function viewpage(p){
	page = p;
	get_page();
}
function get_page(){
	get_product_most_buy()	
}

function get_product_most_buy(){
	var pdata = {
			'fromrecode':(page-1)*recordperpage,
			'recordperpage':recordperpage
	};
	//$("#idloading").css('display','block');
	append_loading("#content_product");
	Return_get("ProductController","search_group",pdata,"GET",function(data){
		if(data!=null){					
			if(data.length>0){     						 
				
				total_page = data[0].rownum /recordperpage;
				total_page=Math.floor(total_page);
				if(data[0].rownum  % recordperpage!=0){
					total_page+=1;
				}     						
				$("#hidden_content_product").css('display','none');
				$("#content_product").text('');	     					
				var str_pro1='';
				var str_pro2='';
				load_text(function(output,str1){
				if(output==true){
					str_pro1=str1;
					load_text2(function(output,str2){
						if(output==true){
							str_pro2=str2;
							
							for(var i=0;i<data.length;i++)
							 { 
							
								if(data[i].isPromo==0){
										var html = str_pro1;
										var base_url_detail = url_detail;
									       base_url_detail = base_url_detail.replace('@id',data[i].productId);
									       base_url_detail = base_url_detail.replace('@url',window.location.href);
									       html = html.replace(/\@href/g,encodeURI(base_url_detail));	     						
										html = html.replace('@idprduct',data[i].productId);
										html = html.replace('@cate',data[i].producttype);
										html = html.replace('@srcimg',ReturnHosing_tomcat()+'upload/product/'+data[i].productImage);
										html = html.replace('@srcimg',ReturnHosing_tomcat()+'upload/product/'+data[i].productimglarg);
										html = html.replace('@id',data[i].productId);
										html = html.replace('@idvalue',data[i].productId);
										html = html.replace('@name',data[i].productName);	     						
										html = html.replace('@price',formatcurrency(data[i].productPrice));		     												
										$("#content_product").append(html);
							 }
								else if(data[i].isPromo==1){
											var html = str_pro2;
											var base_url_detail = url_detail;
										       base_url_detail = base_url_detail.replace('@id',data[i].productId);
										       base_url_detail = base_url_detail.replace('@url',window.location.href);
										       html = html.replace(/\@href/g,encodeURI(base_url_detail));	     						
											html = html.replace('@idprduct',data[i].productId);
											html = html.replace('@cate',data[i].producttype);
											html = html.replace('@srcimg',ReturnHosing_tomcat()+'upload/product/'+data[i].productImage);
											html = html.replace('@srcimg',ReturnHosing_tomcat()+'upload/product/'+data[i].productimglarg);
											html = html.replace('@id',data[i].productId);
											html = html.replace('@idvalue',data[i].productId);
											html = html.replace('@name',data[i].productName);	     						
											var price = formatcurrency(data[i].productPrice);
											html = html.replace('@price',price);   
											html = html.replace('@oldprice',formatcurrency(data[i].price_old));
											$("#content_product").append(html);
											
									
								}
							 }
							
							regis_click_mua();
						}
					});
				}
			});

			$("#idloading").css('display','none');								
			load_page();
		}				
		} 
	});
	function regis_click_mua(){

		$(".btnmua").click(function(){
			var product_id=$(this).data("value");
			
			var quantity=1;
			var id = product_id;
			if(id==null||id==''){
				return;
			}else{
				var base_url_detail = url_detail;
				   base_url_detail = base_url_detail.replace('@id',product_id);
					base_url_detail = base_url_detail.replace('@url',window.location.href);
					window.open(encodeURI(base_url_detail), '_blank');
			}
		});
	}
}