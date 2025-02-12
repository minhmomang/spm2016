package Controller;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import DAL.CategoryPromotionDAL;
import DAL.ProductDAL;
import Helper.ErrorMesage;
import Helper.responseUtf8;
import Model.CategoryPromotionModel;
import Model.ItemProduct;
import Model.Product.ProductData;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;

import BLL.CategoryPromotionBLL;

@Controller
@RequestMapping(value = "CategoryPromotionController")
public class CategoryPromotionController {
	@RequestMapping(value = "get_list_categorypromotion_manager", method = RequestMethod.GET)
	@ResponseBody
	public void get_list_categorypromotion_manager(HttpServletResponse response) throws IOException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		ArrayList<CategoryPromotionModel> list = new ArrayList<CategoryPromotionModel>();
		list = CategoryPromotionDAL.get_list_categorypromotion_manager();
		Gson gson = new Gson();
		JsonElement element = gson.toJsonTree(list, new TypeToken<ArrayList<CategoryPromotionModel>>() {
		}.getType());
		JsonArray jsonArray = element.getAsJsonArray();
		responseUtf8.response_Utf8(response, jsonArray.toString());
	}

	@RequestMapping(value = "upload_image", method = RequestMethod.POST)
	@ResponseBody
	public String upload_image(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		String jsontext = "";
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		ServletContext servl = request.getServletContext();
		// String savePath
		// =servl.getRealPath(File.separator+"Upload"+File.separator+"Feature_Image");
		String folder_save = servl.getInitParameter("save_image_cate_promotion");
		String savePath = servl.getRealPath(folder_save);

		// String savePath =
		// servl.getContextPath()+File.separator+"Upload"+File.separator+"Feature_Image";
		// String savePath2 =
		// request.getServletContext().getInitParameter("savepath2");
		// ////System.out.println(savePath);
		String filename = "";
		if (isMultipart) {
			FileItemFactory factory = new DiskFileItemFactory();
			ServletFileUpload upload = new ServletFileUpload(factory);
			try {
				// Parse the request
				List<org.apache.commons.fileupload.FileItem> multiparts = upload.parseRequest(request);
				for (org.apache.commons.fileupload.FileItem item : multiparts) {
					if (!item.isFormField()) {
						DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
						Calendar cal = Calendar.getInstance();
						// ////System.out.println(dateFormat.format(cal.getTime()));
						// //2014/08/06 16:00:22
						String name = dateFormat.format(cal.getTime()) + "_" + new File(item.getName()).getName();
						filename += name;
						item.write(new File(savePath, name));
						/*
						 * String name = new File(item.getName()).getName();
						 * filename+=name+";"; item.write(new File(savePath2 +
						 * "\\" + name));
						 */
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		// ////System.out.println(filename);
		jsontext = filename;
		return jsontext;
	}

	@RequestMapping(value = "insert_category_promotion", method = RequestMethod.GET)
	@ResponseBody
	public void insert_category_promotion(@RequestParam("type") String type, @RequestParam("id") String id,
			@RequestParam("name") String name, @RequestParam("category_img") String category_img,
			@RequestParam("ngay_ap_dung") String ngay_ap_dung, @RequestParam("ngay_ket_thuc") String ngay_ket_thuc,
			@RequestParam("typedis") String typedis, @RequestParam("valuedis") String valuedis,
			HttpServletResponse response, HttpServletRequest request) throws IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, String> obj = new HashMap<String, String>();
		////System.out.println(name);
		result = CategoryPromotionDAL.insert_category_promotion(type, id, name, category_img, ngay_ap_dung,
				ngay_ket_thuc, typedis, valuedis);
		if (result != null) {
			if (result.size() > 0) {
				String f = result.get("f").toString();
				String mes = ErrorMesage.getMesageError(Integer.parseInt(f));
				obj.put("result", f);
				obj.put("message",mes);

			}
		}
		String json = new Gson().toJson(obj);
		responseUtf8.response_Utf8(response, json);

	}

	@RequestMapping(value = "get_category_promotion_by_id", method = RequestMethod.GET)
	@ResponseBody
	public void get_category_promotion_by_id(@RequestParam("id") String id, HttpServletResponse response)
			throws IOException, ClassNotFoundException, InstantiationException, SQLException {
		CategoryPromotionModel item = new CategoryPromotionModel();
		item = CategoryPromotionDAL.get_category_promotion_by_id(id);
		Gson gson = new Gson();
		String json = gson.toJson(item);
		responseUtf8.response_Utf8(response, json);
	}

	@RequestMapping(value = "delete_cate", method = RequestMethod.GET)
	@ResponseBody
	public void delete_cate(@RequestParam("str") String str, HttpServletResponse response) throws IOException {

		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, String> obj = new HashMap<String, String>();
		result = CategoryPromotionDAL.remove_category(str);
		if (result != null) {
			if (result.size() > 0) {
				String f = result.get("f").toString();
				String mes = ErrorMesage.getMesageError(Integer.parseInt(f));
				obj.put("result", f);
				obj.put("message", mes);

			}
		}
		String json = new Gson().toJson(obj);
		responseUtf8.response_Utf8(response, json);

	}

	@RequestMapping(value = "get_list_productpromotion", method = RequestMethod.GET)
	@ResponseBody
	public void get_list_productpromotion(@RequestParam("cate") String cate, @RequestParam("f_row") String f_row,
			@RequestParam("record") String record, HttpServletRequest request, HttpServletResponse response)
			throws IOException, ClassNotFoundException, InstantiationException, SQLException {

		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		ArrayList<ProductData> list = new ArrayList<ProductData>();
		list = CategoryPromotionDAL.get_list_productpromotion(cate, Integer.parseInt(f_row), Integer.parseInt(record));
		Gson gson = new Gson();
		JsonElement element = gson.toJsonTree(list, new TypeToken<ArrayList<ProductData>>() {
		}.getType());
		JsonArray jsonArray = element.getAsJsonArray();
		responseUtf8.response_Utf8(response, jsonArray.toString());
	}

	@RequestMapping(value = "count_get_list_productpromotion", method = RequestMethod.GET)
	@ResponseBody
	public void count_get_list_product_manager_cate(@RequestParam("cate") String cate, HttpServletRequest request,
			HttpServletResponse response)
			throws IOException, ClassNotFoundException, InstantiationException, SQLException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		int rs = 0;
		rs = CategoryPromotionDAL.count_get_list_productpromotion(cate);
		responseUtf8.response_Utf8(response, String.valueOf(rs));
	}

	@RequestMapping(value = "delete_product_promotion", method = RequestMethod.GET)
	@ResponseBody
	public void delete_product(@RequestParam("str_product") String str_product,
			@RequestParam("p_category_promotion_id") String p_category_promotion_id, HttpServletResponse response)
			throws IOException {

		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, String> obj = new HashMap<String, String>();
		result = CategoryPromotionDAL.delete_product_promotion(str_product, p_category_promotion_id);
		if (result != null) {
			if (result.size() > 0) {
				String f = result.get("f").toString();
				String mes = ErrorMesage.getMesageError(Integer.parseInt(f));
				obj.put("result", f);
				obj.put("message", mes);

			}
		}
		String json = new Gson().toJson(obj);
		responseUtf8.response_Utf8(response, json);

	}

	@RequestMapping(value = "insert_product_to_promotion", method = RequestMethod.GET)
	@ResponseBody
	public void insert_product_to_promotion(
			@RequestParam("strproductid") String strproductid,
			@RequestParam("idcatpromotion") String idcatpromotion, 
			HttpServletResponse response) throws IOException, ClassNotFoundException, InstantiationException, SQLException {

		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		Gson gson = new Gson();
		ArrayList<ItemProduct> list_product = (ArrayList<ItemProduct>) gson.fromJson(strproductid,
				new TypeToken<ArrayList<ItemProduct>>() {
				}.getType());
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, String> obj = new HashMap<String, String>();
		result = CategoryPromotionBLL.insert_product_to_promotion(list_product, idcatpromotion);
		if (result != null) {
			if (result.size() > 0) {
				String f = result.get("f").toString();
				obj.put("result", f);
			}
		}
		String json = new Gson().toJson(obj);
		responseUtf8.response_Utf8(response, json);

	}

	@RequestMapping(value = "get_info_promo_product", method = RequestMethod.GET)
	@ResponseBody
	public void get_info_promo_product(@RequestParam("id") String id, @RequestParam("pro_id") String pro_id,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException, ClassNotFoundException, InstantiationException, SQLException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		ProductData item = new ProductData();
		item = ProductDAL.getInfoPromoProduct(id, pro_id);
		Gson gson = new Gson();
		String str = gson.toJson(item);
		// ////System.out.println("promo:"+str);
		responseUtf8.response_Utf8(response, str);
	}

	@RequestMapping(value = "save_promo_product", method = RequestMethod.GET)
	@ResponseBody
	public void save_promo_product(@RequestParam("id") String id, @RequestParam("pro_id") String pro_id,
			@RequestParam("oldprice") String oldprice, @RequestParam("percent") String percent,
			@RequestParam("newprice") String newprice, HttpServletRequest request, HttpServletResponse response)
			throws IOException, ClassNotFoundException, InstantiationException, SQLException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");

		int result = CategoryPromotionDAL.save_promo_product(id, pro_id, oldprice, percent, newprice);

		responseUtf8.response_Utf8(response, String.valueOf(result));
	}

	@RequestMapping(value = "change_promo_status", method = RequestMethod.GET)
	@ResponseBody
	public void change_promo_status(@RequestParam("promo_id") String promo_id, @RequestParam("status") String status,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException, ClassNotFoundException, InstantiationException, SQLException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		int result = CategoryPromotionDAL.change_promo_status(promo_id, status);

		responseUtf8.response_Utf8(response, String.valueOf(result));
	}
	@RequestMapping(value = "get_promotion_parent", method = RequestMethod.GET)
	@ResponseBody
	public void get_promotion_parent(HttpServletResponse response) throws IOException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		ArrayList<CategoryPromotionModel> list = new ArrayList<CategoryPromotionModel>();
		list = CategoryPromotionDAL.get_promotion_parent();
		Gson gson = new Gson();
		JsonElement element = gson.toJsonTree(list, new TypeToken<ArrayList<CategoryPromotionModel>>() {
		}.getType());
		JsonArray jsonArray = element.getAsJsonArray();
		responseUtf8.response_Utf8(response, jsonArray.toString());
	}
	@RequestMapping(value = "get_promotion_sub", method = RequestMethod.GET)
	@ResponseBody
	public void get_promotion_sub(
			@RequestParam("cate") String cate,
			HttpServletResponse response) throws IOException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		ArrayList<CategoryPromotionModel> list = new ArrayList<CategoryPromotionModel>();
		list = CategoryPromotionDAL.get_promotion_sub(cate);
		Gson gson = new Gson();
		JsonElement element = gson.toJsonTree(list, new TypeToken<ArrayList<CategoryPromotionModel>>() {
		}.getType());
		JsonArray jsonArray = element.getAsJsonArray();
		responseUtf8.response_Utf8(response, jsonArray.toString());
	}
}
