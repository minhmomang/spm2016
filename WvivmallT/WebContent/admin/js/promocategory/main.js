$(function() {
    var type = 'A';
    var list_category = [];
    var list_category_sub = [];
    var source = null;
    var source2 = null;
    var lang = get_lang_current();
    exe_load_header(function(output) {
        if (output == true) {

            load_form_grid();
            load_form_grid_sub_promotion();
            exec_load_data();

        }

    });

    function exec_load_data() {
        blockbg();
        load_data(function(output) {
            if (output == true) {
                unblockbg();
                source.localdata = list_category;
                $("#idcategorypromotion").jqxGrid('updatebounddata');
                $('#idcategorypromotion').jqxGrid('clearselection');

            }
        }, '');
    }

    function load_data(callback, pdata) {
        list_category = [];
        Return_get("CategoryPromotionController", "get_list_categorypromotion_manager", pdata, 'GET', function(data) {
            if (data != null) {
                list_category = data;
                callback(true);
            } else {
                unblockbg();
            }
        });
    }



    function load_form_grid() {
        source = {
            localdata: list_category,
            datatype: "array",
            datafields: [{
                name: 'category_promotion_id',
                type: 'string'
            }, {
                name: 'name',
                type: 'string'
            }, {
                name: 'type',
                type: 'string'
            }, {
                name: 'value',
                type: 'string'
            }, {
                name: 'datecreate',
                type: 'string'
            }, {
                name: 'image',
                type: 'string'
            },{
                name: 'title_img',
                type: 'string'
            },{
                name: 'ngay_ap_dung',
                type: 'string'
            },{
                name: 'ngay_ket_thuc',
                type: 'string'
            },{
                name: 'status',
                type: 'string'
            }]

        };
        ///end source
        var dataAdapter = new $.jqx.dataAdapter(source);
        $("#idcategorypromotion").jqxGrid({
            width: get_width(),
            source: dataAdapter,
            columnsresize: true,
            pageable: true,
            height: get_height(),
            selectionmode: 'checkbox',
            columns: [{
                text: 'Mã',
                datafield: 'category_promotion_id',
                cellsalign: 'center',
                align: 'center',
                width: 150
            }, {
                text: 'Tên',
                datafield: 'name',
                cellsalign: 'left',
                align: 'center',
                width: 350
            }, {
                text: 'Loại',
                datafield: 'type',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },{
                text: 'Giá trị',
                datafield: 'value',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },{
                text: 'Ngày tạo',
                datafield: 'datecreate',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },{
                text: 'Hình',
                datafield: 'image',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },
            {
                text: 'Tiêu đề',
                datafield: 'title_img',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },
            {
                text: 'Ngày áp dụng',
                datafield: 'ngay_ap_dung',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },
            {
                text: 'Ngày kết thúc',
                datafield: 'ngay_ket_thuc',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },
            {
                text: 'Trạng thái',
                datafield: 'status',
                cellsalign: 'left',
                align: 'center',
                width: 75
            }]
        });

    }

    function get_cate_product() {
        var getselectedrowindexes = $("#idcategorypromotion").jqxGrid('getselectedrowindexes');
        var product_id = '';
        if (getselectedrowindexes.length > 0) {
            var selectedRowData = $("#idcategorypromotion").jqxGrid('getrowdata',
                getselectedrowindexes[0]);
            product_id = selectedRowData["category_promotion_id"];
        }
        return product_id;
    }


    $("#btnload").click(function() {
		exec_load_data();
    });
    function clear_input(){
    	$("#idtype").val("");
    	$("#idname").val("");
    	$("#idtype").css("display","inline-block");
    	$("#idname").css("display","inline-block");
    	$("#idtype").removeAttr( "disabled" );
    
    	document.getElementById("upload_immg").reset();
    	$("#strongmessage").text("");
    	
    }
    $("#btncreate").click(function() {
    	
        type = 'A';
        clear_input();
        $("#dlgcreate").css('display', 'block');
        $('#dlgcreate').dialog({
            autoOpen: false,
            title: 'Tạo chương trình khuyến mãi',
            width: 400,
            height: 380,
            buttons: [{
                text: 'OK',
                iconCls: 'icon-ok',
                handler: function() {
                    exec_cate(function(out) {
                        if (out) {
                            exec_load_data();
                            $(dlgcreate).dialog('close');
                        }

                    });
                }
            }, {
                text: 'Cancel',
                iconCls: 'icon-cancel',
                handler: function() {
                    $("#dlgcreate").dialog('close');
                }
            }]
        });
        $("#id_ngayketthuc").datebox('setValue',"");
        $("#id_ngayapdung").datebox('setValue',"");
        $("#id_ngayapdung").datebox('enable');
        $("#id_ngayketthuc").datebox('enable');
        $(dlgcreate).dialog('open');
        
    });

    function exec_cate(callback) {
        var id = $("#idtype").val();
        var name = $("#idname").val();
        var dateapdung=$("#id_ngayapdung").datebox('getValue');
        var dateketthuc=$("#id_ngayketthuc").datebox('getValue');        
        var category_img=$("#id_uploadsuccess").val();
        var typedis = $("#slcpromo").val();
        var valuedis = $("#idvaluediscount").numberbox('getValue');
        if(category_img==""||category_img==undefined){
        	category_img="null";
        }
        if (id == null || id == '') {
            showdialog('dialogmanual', 0, 'Vui lòng nhập mã!', '', '');
            callback(false);
            return;
        }

        if (name == null || name == '') {
            showdialog('dialogmanual', 0, 'Vui lòng nhập tên', '', '');
            callback(false);
            return;
        }
        if(dateapdung==null||dateapdung==''){
        	 showdialog('dialogmanual', 0, 'Vui lòng nhập ngày áp dụng', '', '');
             callback(false);
             return;
        }
        if(dateketthuc==null||dateketthuc==''){
       	 showdialog('dialogmanual', 0, 'Vui lòng nhập ngày kết thúc', '', '');
            callback(false);
            return;
        }
        if(valuedis==null||valuedis==''){
          	 showdialog('dialogmanual', 0, 'Vui lòng nhập giá trị giảm', '', '');
               callback(false);
               return;
        }
        blockbg();
        var pdata = {
            'type': type,
            'id': id,
            'name': name,
            'category_img':category_img,
            'ngay_ap_dung':dateapdung,
            'ngay_ket_thuc':dateketthuc,
            'typedis':typedis,
            'valuedis':valuedis
            
        };
        Return_get("CategoryPromotionController", "insert_category_promotion", pdata, "GET", function(data) {
            if (data != null) {
                unblockbg();
                var error = parseInt(data.result);

                if (error == 0) {
                	set_form();
                    showdialog('dialogmanual', 0, 'Xử lý thành công', '', '');
                    callback(true);
                } else if (error == 1) {
                    showdialog('dialogmanual', 0, 'Mã đã tồn tại', '', '');
                    callback(false);
                } else {
                    showdialog('dialogmanual', 0, data.message, '', '');
                    callback(false);
                }
            } else {
                showdialog('dialogmanual', 0, 'Thêm không thành công', '', '');
                callback(false);
            }
        });

    }
    function set_form(){
    	$("#idtype").val('');
        $("#idname").val('');
        $("#id_ngayapdung").datebox('setValue','');
        $("#id_ngayketthuc").datebox('setValue','');
        $("#slcpromo").val('');
        $("#idvaluediscount").numberbox('setValue','');
    }
    var idcurrent = '';

    function load_category_by_id(id, callback) {
        var pdata = {
            'id': id
        };
        Return_get("CategoryPromotionController", "get_category_promotion_by_id", pdata, 'GET', function(data) {
            if (data != null) {
                $("#idtype").prop('disabled', true);
                $("#idtype").val(data.category_promotion_id);
                $("#idname").val(data.name);
                $("#id_uploadsuccess").val(data.image);
                $("#strongmessage").text("Current img:"+data.image);
                $("#strongmessage").show();
                $("#id_ngayapdung").datebox('setValue',data.ngay_ap_dung);
                $("#id_ngayketthuc").datebox('setValue',data.ngay_ket_thuc);
                $("#id_ngayapdung").datebox('disable');
                $("#id_ngayketthuc").datebox('disable');
                $("#slcpromo").val(data.type);
                $("#idvaluediscount").numberbox('setValue',data.value);
                callback(true);
            }
        });
    }
    $("#btnupdate").click(function() {
       // var id = get_cate_product();
        var id="";
    	var flag=$(this).attr('id');
    		id = get_sing_selected();
    	
        if (id == null || id == '') {
            showdialog('dialogmanual', 0, 'Vui lòng chọn chương trình khuyến mãi hoặc chỉ chọn 1 chương trình khuyến mãi', '', '');
            return;
        }
        type = 'E';
        idcurrent = id;
        load_category_by_id(id, function(out) {
            $("#dlgcreate").css('display', 'block');
            $('#dlgcreate').dialog({
                autoOpen: false,
                title: 'Cập nhật chương trình khuyến mãi',
                width: 400,
                height: 380,
                buttons: [{
                    text: 'OK',
                    iconCls: 'icon-ok',
                    handler: function() {         
                    	exec_cate(function(out) {
                            if (out) {
                                exec_load_data();
                                $("#idtype").prop('disabled', false);
                                $(dlgcreate).dialog('close');
                                $('#id_sub_promotion').jqxGrid('clearselection');
                                $('#iddlgchangeprice').dialog('close');
                            }

                        });
                    }
                }, {
                    text: 'Cancel',
                    iconCls: 'icon-cancel',
                    handler: function() {
                        $("#dlgcreate").dialog('close');
                    }
                }]
            });
            $(dlgcreate).dialog('open');
        });
    });

   
    $("#btnremove,#btnremove_sub").click(function() {
    	  var id="";
    	var flag=$(this).attr('id');
    	if(flag=="btnremove")
    		id = get_sing_selected();
    	else{
    		id = get_sing_selected_sub();
    	}
      
        if (id == null || id == '') {
            showdialog('dialogmanual', 0, 'chỉ chọn 1 mã để xóa', '', '');
            return;
        }
        showdialogconfirmfunc('dialogmanual', 'Bạn có muốn xóa không?', function() {
        	
            if (id != null) {
                blockbg();
                var pdata = {
                    'str': id
                };
                Return_get("CategoryPromotionController", "delete_cate", pdata, "GET", function(data) {
                    if (data != null) {
                        unblockbg();
                        var error = parseInt(data.result);
                        if (error == 0) {         
                        	if(flag=="btnremove")
                        	{
                        		exec_load_data();
                        	}
                        	else{
                        		reload_promosub();	
                        	}
                            
                            showdialog('dialogmanual', 0, 'Xóa thành công', '', '');
                        } else {
                            showdialog('dialogmanual', 0, data.message, '', '');

                        }
                    } else {
                        showdialog('dialogmanual', 0, 'Xóa không thành công', '', '');
                        return;
                    }
                });
            }
        });
    });

    function get_munti_selected() {
        var c = '';
        var rows = $("#idcategorypromotion").jqxGrid('selectedrowindexes');
        if (rows.length > 0) {
            for (var m = 0; m < rows.length; m++) {
                var row = $("#idcategorypromotion").jqxGrid('getrowdata', rows[m]);
                c += "'" + row["category_promotion_id"] + "'" + ",";
            }
            c = c.substring(0, c.length - 1);
        }
        return c;
    }
    function get_sing_selected() {
        var c = '';
        var rows = $("#idcategorypromotion").jqxGrid('selectedrowindexes');       
        if (rows.length ==1) {          
                var row = $("#idcategorypromotion").jqxGrid('getrowdata', rows[0]);
                c = row["category_promotion_id"] ;        
        }            	
        return c;
    } 
  
    var url = ReturnHosing()+"CategoryPromotionController/upload_image.htm";;
    $('input[name="txtimage"]').ajaxfileupload({
        'action': url,
        'onComplete': function(response) {
            $('#upload').hide();
            $('#strongmessage').show();
            var statusVal = JSON.stringify(response.status);

            if (statusVal == "false") {
                $("#strongmessage").html("<font color='red'>" + JSON.stringify(response.message) + " </font>");
            }
            if (statusVal == "true") {
                $("#strongmessage").html("<font color='green'>" + JSON.stringify(response.message) + " </font>");
            }
            var pram = JSON.stringify(response.pram);
            var first = pram.indexOf('"');
            var last = pram.lastIndexOf('"');
            pram = pram.substring(first + 1, last);
			
            $("#id_uploadsuccess").val(pram);

        },
        'onStart': function() {
            $('#upload').show();
            $('#strongmessage').hide();
        }
    });
    $("#btndisable,#btndisable_sub").click(function(){
    	//var promo_id = get_sing_selected();
    	 var promo_id="";
     	var flag=$(this).attr('id');
     	if(flag=="btndisable")
     		promo_id = get_sing_selected();
     	else{
     		promo_id = get_sing_selected_sub();
     	}
    	if(promo_id==null||promo_id==''){
    		showdialog('dialogmanual', 0, 'Vui lòng chọn mã hoặc chỉ chọn 1 mã', '', '');
    		return;
    	}
    	var status='0';
    	var pdata={'promo_id':promo_id,
    			'status':status}
    	Return_get("CategoryPromotionController","change_promo_status",pdata,"GET",function(data){
    		if(data!=null){
    			if(data=='0'){
					if(flag=="btndisable")
		        	{
		        		exec_load_data();
		        	}
		        	else{
		        		reload_promosub();	
		        	}
    				showdialog('dialogmanual', 0, 'Thay đổi trạng thái thành công', '', '');    				
    				//  $('#id_sub_promotion').jqxGrid('clearselection');
                    //  $('#iddlgchangeprice').dialog('close');
    			}
    			else if(data=='1'){
    				showdialog('dialogmanual', 0, 'Thay đổi trạng thái không thành công', '', '');
    				exec_load_data();
    				//  $('#id_sub_promotion').jqxGrid('clearselection');
                    //  $('#iddlgchangeprice').dialog('close');
    			}
    			else{
    				showdialog('dialogmanual', 0, 'Thay đổi trạng thái không thành công', '', '');
    				exec_load_data();
    			}
    		}
    	})
    });
    $("#btnenable,#btnenable_sub").click(function(){
    	//var promo_id = get_sing_selected();
    	var flag=$(this).attr('id');
     	if(flag=="btnenable")
     		promo_id = get_sing_selected();
     	else{
     		promo_id = get_sing_selected_sub();
     	}
    	if(promo_id==null||promo_id==''){
    		showdialog('dialogmanual', 0, 'Vui lòng chọn mã hoặc chỉ chọn 1 mã', '', '');
    		return;
    	}
    	var status='1';
    	var pdata={'promo_id':promo_id,
    			'status':status}
    	Return_get("CategoryPromotionController","change_promo_status",pdata,"GET",function(data){
    		if(data!=null){
    			if(data=='0'){
    				if(flag=="btnenable")
		        	{
		        		exec_load_data();
		        	}
		        	else{
		        		reload_promosub();	
		        	}
    				showdialog('dialogmanual', 0, 'Thay đổi trạng thái thành công', '', '');    				
    			}
    			
    			else {
    				showdialog('dialogmanual', 0, 'Thay đổi trạng thái không thành công', '', '');
    				exec_load_data();
    				  $('#id_sub_promotion').jqxGrid('clearselection');
                      $('#iddlgchangeprice').dialog('close');
    			}
    		}
    	})
    });
   
    function load_form_grid_sub_promotion() {
        source2 = {
            localdata: list_category_sub,
            datatype: "array",
            datafields: [{
                name: 'category_promotion_id',
                type: 'string'
            }, {
                name: 'name',
                type: 'string'
            }, {
                name: 'type',
                type: 'string'
            }, {
                name: 'value',
                type: 'string'
            }, {
                name: 'datecreate',
                type: 'string'
            }, {
                name: 'image',
                type: 'string'
            },{
                name: 'title_img',
                type: 'string'
            },{
                name: 'ngay_ap_dung',
                type: 'string'
            },{
                name: 'ngay_ket_thuc',
                type: 'string'
            },{
                name: 'status',
                type: 'string'
            }]

        };
        ///end source
        var dataAdapter = new $.jqx.dataAdapter(source2);
        $("#id_sub_promotion").jqxGrid({
            width: 890,
            source: dataAdapter,
            columnsresize: true,
            pageable: true,
            height: 550,
            selectionmode: 'checkbox',
            columns: [{
                text: 'Mã',
                datafield: 'category_promotion_id',
                cellsalign: 'center',
                align: 'center',
                width: 150
            }, {
                text: 'Tên',
                datafield: 'name',
                cellsalign: 'left',
                align: 'center',
                width: 350
            }, {
                text: 'Loại',
                datafield: 'type',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },{
                text: 'Giá trị',
                datafield: 'value',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },{
                text: 'Ngày tạo',
                datafield: 'datecreate',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },{
                text: 'Hình',
                datafield: 'image',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },
            {
                text: 'Tiêu đề',
                datafield: 'title_img',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },
            {
                text: 'Ngày áp dụng',
                datafield: 'ngay_ap_dung',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },
            {
                text: 'Ngày kết thúc',
                datafield: 'ngay_ket_thuc',
                cellsalign: 'left',
                align: 'center',
                width: 150
            },
            {
                text: 'Trạng thái',
                datafield: 'status',
                cellsalign: 'left',
                align: 'center',
                width: 75
            }]
        });

    }
    $("#btnlistchangeprice").click(function(){
    	var promo_id = get_sing_selected();
    	if(promo_id==null||promo_id==''){
    		showdialog('dialogmanual', 0, 'Vui lòng chọn mã hoặc chỉ chọn 1 mã', '', '');
    		return;
    	}
    	var pdata = {
    			'cate':promo_id
    	}
    	blockbg();
       load_sub_promotion_data(function(out){    	  
    	   unblockbg();          
    	   source2.localdata = list_category_sub;
           $("#id_sub_promotion").jqxGrid('updatebounddata');
          // $('#id_sub_promotion').jqxGrid('clearselection');
           ///
    	   $("#iddlgchangeprice").css('display','block');		
     	   $('#iddlgchangeprice').dialog({
                autoOpen: false,
                title:'List Change Price',
                width: 920,
                height:700,
               
            });      
     	   $('#iddlgchangeprice').dialog('open');
       },pdata);       
    });
    function load_sub_promotion_data(callback, pdata) {
        list_category_sub = [];
        Return_get("CategoryPromotionController", "get_promotion_sub", pdata, 'GET', function(data) {
            if (data != null) {
            	list_category_sub = data;
                callback(true);
            } else {
                unblockbg();
            }
        });
    }
    
    
    
    
    function get_munti_selected_sub() {
        var c = '';
        var rows = $("#id_sub_promotion").jqxGrid('selectedrowindexes');
        if (rows.length > 0) {
            for (var m = 0; m < rows.length; m++) {
                var row = $("#id_sub_promotion").jqxGrid('getrowdata', rows[m]);
                c += "'" + row["category_promotion_id"] + "'" + ",";
            }
            c = c.substring(0, c.length - 1);
        }
        return c;
    }
    function get_sing_selected_sub() {
        var c = '';
        var rows = $("#id_sub_promotion").jqxGrid('selectedrowindexes');       
        if (rows.length ==1) {          
                var row = $("#id_sub_promotion").jqxGrid('getrowdata', rows[0]);
                c = row["category_promotion_id"] ;        
        }            	
        return c;
    } 
    
    function exec_cate_promo_sub(callback,parent_promo_id,subtype) {
        var id = $("#idtype").val();
        var name = $("#idname").val();
        var dateapdung=$("#id_ngayapdung").datebox('getValue');
        var dateketthuc=$("#id_ngayketthuc").datebox('getValue');        
        var category_img=$("#id_uploadsuccess").val();
        var typedis = $("#slcpromo").val();
        var valuedis = $("#idvaluediscount").numberbox('getValue');
        if(category_img==""||category_img==undefined){
        	category_img="null";
        }
        if (id == null || id == '') {
            showdialog('dialogmanual', 0, 'Vui lòng nhập mã!', '', '');
            callback(false);
            return;
        }

        if (name == null || name == '') {
            showdialog('dialogmanual', 0, 'Vui lòng nhập tên', '', '');
            callback(false);
            return;
        }
        if(dateapdung==null||dateapdung==''){
        	 showdialog('dialogmanual', 0, 'Vui lòng nhập ngày áp dụng', '', '');
             callback(false);
             return;
        }
        if(dateketthuc==null||dateketthuc==''){
       	 showdialog('dialogmanual', 0, 'Vui lòng nhập ngày kết thúc', '', '');
            callback(false);
            return;
        }
        if(valuedis==null||valuedis==''){
          	 showdialog('dialogmanual', 0, 'Vui lòng nhập giá trị giảm', '', '');
               callback(false);
               return;
        }
        blockbg();
        var pdata = {
            'type': subtype,
            'parent_promo_id':parent_promo_id,
            'id': id,
            'name': name,
            'category_img':category_img,
            'ngay_ap_dung':dateapdung,
            'ngay_ket_thuc':dateketthuc,
            'typedis':typedis,
            'valuedis':valuedis
            
        };
        Return_get("CategoryPromotionSubController", "insert_category_promotion_sub", pdata, "GET", function(data) {
            if (data != null) {
                unblockbg();
                var error = parseInt(data.result);

                if (error == 0) {
                	set_form();
                    showdialog('dialogmanual', 0, 'Xử lý thành công', '', '');
                    callback(true);
                } else if (error == 1) {
                    showdialog('dialogmanual', 0, 'Mã đã tồn tại', '', '');
                    callback(false);
                } else {
                    showdialog('dialogmanual', 0, data.message, '', '');
                    callback(false);
                }
            } else {
                showdialog('dialogmanual', 0, 'Thêm không thành công', '', '');
                callback(false);
            }
        });

    }
    
    
    $("#btnchangeprice,#btncreate_sub").click(function() {
    	var parent_promotion_id=get_sing_selected();
    	if(parent_promotion_id==null||parent_promotion_id==''){
    		showdialog('dialogmanual', 0, 'Vui lòng chọn mã hoặc chỉ chọn 1 mã', '', '');
    		return;
    	}else{
    		   var subtype = 'A';
    	        clear_input();
    	        $("#dlgcreate").css('display', 'block');
    	        $('#dlgcreate').dialog({
    	            autoOpen: false,
    	            title: 'Điều chỉnh giá cho mã: '+parent_promotion_id,
    	            width: 400,
    	            height: 380,
    	            buttons: [{
    	                text: 'OK',
    	                iconCls: 'icon-ok',
    	                handler: function() {
    	                    exec_cate_promo_sub(function(out) {
    	                        if (out) {
    	                           // exec_load_data();
    	                            $(dlgcreate).dialog('close');
    	                            reload_promosub();
    	                        }

    	                    },parent_promotion_id,subtype);
    	                }
    	            }, {
    	                text: 'Cancel',
    	                iconCls: 'icon-cancel',
    	                handler: function() {
    	                    $("#dlgcreate").dialog('close');
    	                }
    	            }]
    	        });
    	        $("#id_ngayketthuc").datebox('setValue',"");
    	        $("#id_ngayapdung").datebox('setValue',"");
    	        $("#id_ngayapdung").datebox('enable');
    	        $("#id_ngayketthuc").datebox('enable');
    	        $(dlgcreate).dialog('open');
    	}
    
    });
    $("#btnupdate_sub").click(function() {
        // var id = get_cate_product();
    	var parent_promotion_id=get_sing_selected();
     	var	id = get_sing_selected_sub();
         if (id == null || id == '') {
             showdialog('dialogmanual', 0, 'Select row', '', '');
             return;
         }
         var subtype = 'E';
         idcurrent = id;
         load_category_by_id(id, function(out) {
             $("#dlgcreate").css('display', 'block');
             $('#dlgcreate').dialog({
                 autoOpen: false,
                 title: 'Cập nhật chương trình khuyến mãi',
                 width: 400,
                 height: 380,
                 buttons: [{
                     text: 'OK',
                     iconCls: 'icon-ok',
                     handler: function() {         
                    	 exec_cate_promo_sub(function(out) {
                             if (out) {
//                                 exec_load_data();
//                                 $("#idtype").prop('disabled', false);
//                                 $(dlgcreate).dialog('close');
//                                 $('#id_sub_promotion').jqxGrid('clearselection');
//                                 $('#iddlgchangeprice').dialog('close');
                            	   $("#idtype").prop('disabled', false);
                            	   $(dlgcreate).dialog('close');
 	                               reload_promosub();
                             }

                         },parent_promotion_id,subtype);
                     }
                 }, {
                     text: 'Cancel',
                     iconCls: 'icon-cancel',
                     handler: function() {
                         $("#dlgcreate").dialog('close');
                     }
                 }]
             });
             $(dlgcreate).dialog('open');
         });
     });
    
    function reload_promosub(){
    	var promo_id = get_sing_selected();
    	var pdata = {
    			'cate':promo_id
    	}
    	  list_category_sub = [];
    	  
          Return_get("CategoryPromotionController", "get_promotion_sub", pdata, 'GET', function(data) {
              if (data != null) {
              	list_category_sub = data;
              	 source2.localdata = list_category_sub;
                 $("#id_sub_promotion").jqxGrid('updatebounddata');
               $('#id_sub_promotion').jqxGrid('clearselection');
                  
              } else {
                  unblockbg();
              }
          });
    }
    
    
    $("#btnload_sub").click(function(){
    	reload_promosub();
    });
    
});