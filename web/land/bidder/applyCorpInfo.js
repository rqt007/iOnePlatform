var pageObj = {};
pageObj.valueTag = 'applyCorp';

pageObj.initPage1 = function() {
	pageObj.addcorp();
	$('#btnAddCorp')
			.click(
				function(){
					var html = '';
					html += '<tr>';
					html += '	 <td><input type="text"  value="" class="input_long" tag="name" memo="股东名称"/></td>';
					html += '	 <td><input type="text"  value="" class="input_long" tag="idno" memo="身份证号码/营业执照编号/组织编码"/></td>';
					html += '	 <td><input type="text"  value="" class="input_long" tag="tel" memo="电话"/></td>';
					html += '	 <td><input type="text"  value="" class="input_long" tag="address" memo="地址"/></td>';
					html += '	 <td><input type="text"  value="" class="input_long" tag="email" memo="电子邮箱"/></td>';
					html += '	 <td><input type="text"  value="" class="input_long" tag="reamrk" memo="备注"/></td>';
					html += '    <td><input type="text"  value="" class="input_short" tag="percent" memo="投资比例" onkeyup="pageObj.corpKeyDown();"/>';
					html += '    ％</td>';
					html += '  <td align="center"><input type="button" value="删除" onclick="pageObj.trDel(this);" /></td>';
					html += '</tr>';
					$('#projectTableTBody').append(html);
					Utils.autoIframeSize();
				}
			);
}
pageObj.addcorp=function() {
	var html = '';
	html += '<tr>';
	html += '	 <td><input type="text" id="aaa" value="'+pageObj.userName+'" class="input_long" tag="name" memo="股东名称"/></td>';
	html += '	 <td><input type="text"  value="" class="input_long" tag="idno" memo="身份证号码/营业执照编号/组织编码"/></td>';
	html += '	 <td><input type="text"  value="" class="input_long" tag="tel" memo="电话"/></td>';
	html += '	 <td><input type="text"  value="" class="input_long" tag="address" memo="地址"/></td>';
	html += '	 <td><input type="text"  value="" class="input_long" tag="email" memo="电子邮箱"/></td>';
	html += '	 <td><input type="text"  value="" class="input_long" tag="reamrk" memo="备注"/></td>';
	html += '    <td><input type="text"  value="" class="input_short" tag="percent" memo="投资比例" onkeyup="pageObj.corpKeyDown();"/>';
	html += '    ％</td>';
	html += '  <td align="center"><input type="button" value="删除" onclick="pageObj.trDel(this);" /></td>';
	html += '</tr>';
	$('#projectTableTBody').append(html);
	Utils.autoIframeSize();
}
pageObj.initPage2 = function(data) {
	var cmd = new Command();
	cmd.module = "bidder";
	cmd.service = "Apply";
	cmd.method = 'getBillInfo';
	cmd.valueTag = pageObj.valueTag;
	cmd.licenseId = pageObj.licenseId;
	cmd.success = function(data) {
		var company = data.company;
		if(company!=null&&company!=""&&company!="undefined"&&company!="null"){
			var owners = company.owners;
			var inputs = $('#corpInfoTable input');
			inputs.each(function(i, ele) {
				$(ele).val(company[ele.id]);
			});
			var html = '';
			for ( var i = 0; i < owners.length; i++) {
				html += '<tr>';
				html += '	 <td>' + owners[i].name + '</td>';
				html += '	 <td>' + owners[i].idno + '</td>';
				html += '	 <td>' + owners[i].tel + '</td>';
				if(!owners[i].address) html += '	 <td></td>';
				else html += '	 <td>' + owners[i].address + '</td>';
				if(!owners[i].email) html += '	 <td></td>';
				else html += '	 <td>' + owners[i].email + '</td>';
				if(!owners[i].reamrk) html += '	 <td></td>';
				else html += '	 <td>' + owners[i].reamrk + '</td>';
				html += '    <td>' + owners[i].percent + '％</td>';
				html += '</tr>';
			}
			$('#projectTableTBody').html(html);
			$('#corpTotal').html('100％');
			$('#opTd').hide();
			$('#corpInfoTable').show();
			$('#dtlTable').show();
			$('#corpInfoMsg1').hide();
			Utils.autoIframeSize();
		}else{
			//$('#gs').hide();
			window.parent.pageObj.applyCorpInfoHide();
		}
	};
	cmd.execute();
}

pageObj.getValue = function(cmd) {
	var corp = window.parent.pageObj.corpVal;
	if(corp=="0"){
		var obj = {};
		var name = $('#name').val();
		var contact = $('#contact').val();
		var contact_tel = $('#contact_tel').val();
		var gstype=$("input[name='gstype']:checked").val();
		if(gstype!=0 && gstype!=1 ){
			DialogAlert("请选择企业类别。",parent);
			return false;
		}
		
		
		if(gstype!=0 && gstype!=1 ){
			DialogAlert("请选择企业类别。",parent);
			return false;
		}
		if(contact=="" ){
			DialogAlert("联系人不能为空。",parent);
			return false;
		}
		
		if(contact_tel=="" ){
			DialogAlert("联系人电话不能为空。",parent);
			return false;
		}
//		if($('#name').val().trim()==""){
//			//DialogAlert("公司名称不能为空!",parent);
//			DialogAlert("请贵方在系统完整填写必填项目，确保竞买申请的顺利进行。",parent);
//			return false;
//		}
		if(isNaN($('#reg_capital').val())){
			DialogAlert("注册资金必须是数字!",parent);
			return false;
		}
//		if(name!=""){
			var inputs = $('#corpInfoTable input');
			inputs.each(function(i, ele) {
				obj[ele.id] = $(ele).val();
			});
			obj['gs_type']=gstype;
			var trs = $("#projectTableTBody").children("tr");
			var total = 0;
			obj.proportions = [];
			var names = [];
			for ( var i = 0; i < trs.length; i++) {
				inputs = $(trs[i]).children().children("input[tag]");
				var corp = {};
				for ( var j = 0; j < inputs.length; j++) {
					var ele = $(inputs[j]);
					var tag = ele.attr("tag");
					var value = ele.val().trim();
					var memo = ele.attr("memo");
					if(tag!="address"&&tag!="email"&&tag!="reamrk"){
						if (!value) {
							//DialogAlert("第" + (i + 1) + "行：" + memo + "为空!", parent);
							DialogAlert("请贵方在系统完整填写必填项目，确保竞买申请的顺利进行。",parent);
							return false;
						}
					}
					if (tag == 'percent'){
						if (isNaN(value)) {
							DialogAlert("第" + (i + 1) + "行：" + memo + "不为数字!",
									parent);
							ele.focus();
							return false;
						} else if(value<=0){
							DialogAlert("第" + (i + 1) + "行：" + memo
									+ "不能为0、负数等!", parent);
							ele.focus();
							return false;
						} else {
							var valuef = parseFloat(value);
							if (!valuef.nDigits(2)) {
								DialogAlert("第" + (i + 1) + "行：" + memo
										+ "最多保留两位小数!", parent);
								ele.focus();
								return false;
							}
							total = total.add(valuef);
						}
					}
					if(tag == 'name'){
						names[i] = value;
					}
					corp[tag] = value;
				}
				obj.proportions.push(corp);
				//股东必须是竞买人
			}
			var st="0";
			for(var i=0;i<names.length;i++){
				if(names[i].trim()==pageObj.userName) st="1";
			}
			if (total.sub(100) != 0) {
				if(trs.length>1){
					DialogAlert("贵方所录入的联合体成员所占土地使用权份额比例不足100%，请重新填写。", parent);
				}else{
					DialogAlert("贵方所录入的项目公司股东的投资比例不足100%，请重新填写。", parent);
				}
				return false;
			}
			if(st=="0"){
				DialogAlert("股东列表必须有当前竞买申请人!", parent);
				return false;
			}
		}
		cmd[pageObj.valueTag] = JSON.stringify(obj);
//	}
	return true;
}

pageObj.corpKeyDown = function() {
	var total = 0;
	$('#projectTableTBody tr td').children("input[tag=percent]").each(
			function(i, ele) {
				try {
					var cv = $(ele).val().trim();
					if (cv && !isNaN(cv)) {
						total = total.add(parseFloat(cv));
					}
				} catch (ex) {
				}
			});
	$('#corpTotal').html('合计:' + total + '％');
}

pageObj.trDel = function(ele) {
	$(ele).parents('tr').remove();
	$('#unionTableTBody tr').children(".numClass").each(function(i, ele) {
		$(ele).html(i + 1);
	});
	//pageObj.unionKeyDown();
	pageObj.corpKeyDown();
	Utils.autoIframeSize();
}

$(document).ready(function() {
	pageObj.mode = Utils.getPageValue('mode');
	pageObj.licenseId = Utils.getPageValue('licenseId');
	pageObj.userName = parent.pageObj.userName;
	switch (pageObj.mode) {
	case 'edit':
		pageObj.initPage1();
		break;
	case 'view':
		pageObj.initPage2();
		break;
	}
	Utils.autoIframeSize();
	
	$('#gstype1').click(function() {
		var gstype=$("input[name='gstype']:checked").val();
		if(gstype==0){
			$("#gsmessage").html("您选择的是内资公司,拟成立新公司的时间是合同签订日起30日内，需经公证。");
		}else{
			$("#gsmessage").html("");
		}
	});
	$('#gstype2').click(function() {
		var gstype=$("input[name='gstype']:checked").val();
		if(gstype==1){
			$("#gsmessage").html("您选择的是外资公司,拟成立子公司的成立时间需合同签订日起90日内!");
		}else{
			$("#gsmessage").html("");
		}
	});
	
//	$('#testBtn').click(function() {
//		pageObj.getValue({});
//	});
});