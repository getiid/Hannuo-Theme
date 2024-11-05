<?php
// 在文件开头添加
define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
define('JWT_AUTH_CORS_ENABLE', true);

// 修改CORS设置
function add_cors_headers() {
    // 允许所有域名访问（开发环境）
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
    header('Access-Control-Allow-Credentials: true');
    
    // 处理预检请求
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'add_cors_headers');

// 添加额外的CORS支持
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
}, 15);

// 添加REST API调试
function debug_rest_api($result, $server, $request) {
    error_log('REST API Request: ' . $request->get_route());
    error_log('Request Parameters: ' . print_r($request->get_params(), true));
    
    if (is_wp_error($result)) {
        error_log('REST API Error: ' . $result->get_error_message());
    }
    
    return $result;
}
add_filter('rest_pre_dispatch', 'debug_rest_api', 10, 3);

// 确保REST API可用
function ensure_rest_api() {
    remove_filter('rest_enabled', '__return_false');
    remove_filter('rest_jsonp_enabled', '__return_false');
    
    add_filter('rest_authentication_errors', function($result) {
        if (!empty($result)) {
            return $result;
        }
        if (!is_user_logged_in()) {
            return true;
        }
        return $result;
    });
}
add_action('init', 'ensure_rest_api');

// 修改REST API返回
function custom_rest_prepare_post($data, $post, $request) {
    $_data = $data->data;
    
    // 添加特色图片URL
    if (has_post_thumbnail($post->ID)) {
        $_data['featured_image'] = get_the_post_thumbnail_url($post->ID, 'full');
    }
    
    // 添加文章分类
    $_data['categories_info'] = get_the_category($post->ID);
    
    // 添加ACF字段
    if (function_exists('get_fields')) {
        $_data['acf'] = get_fields($post->ID);
        error_log('ACF fields for post ' . $post->ID . ': ' . print_r($_data['acf'], true));
    }
    
    $data->data = $_data;
    return $data;
}
add_filter('rest_prepare_post', 'custom_rest_prepare_post', 10, 3);

// 修改页面REST API返回
function custom_rest_prepare_page($data, $post, $request) {
    $_data = $data->data;
    
    error_log('Processing page in REST API: ' . $post->ID . ' - ' . $post->post_title);
    error_log('Post type: ' . $post->post_type);
    error_log('Post status: ' . $post->post_status);
    
    // 获取并记录原始ACF字段
    if (function_exists('get_fields')) {
        $fields = get_fields($post->ID);
        error_log('Raw ACF fields: ' . print_r($fields, true));
        
        if ($fields) {
            // 确保所有字段都被正确处理
            $_data['company_name'] = $fields['company_name'] ?? null;
            $_data['address'] = $fields['address'] ?? null;
            $_data['phone'] = $fields['phone'] ?? null;
            $_data['email'] = $fields['email'] ?? null;
            $_data['map_coordinates'] = $fields['map_coordinates'] ?? null;
            $_data['working_hours'] = $fields['working_hours'] ?? [];
            $_data['social_media'] = $fields['social_media'] ?? [];
            
            // 记录处理后的数据
            error_log('Processed fields: ' . print_r($_data, true));
        } else {
            error_log('No ACF fields found for page ' . $post->ID);
        }
    } else {
        error_log('ACF function get_fields not available');
    }
    
    $data->data = $_data;
    return $data;
}
add_filter('rest_prepare_page', 'custom_rest_prepare_page', 10, 3);

// 注册自定义文章类型
function register_custom_post_types() {
    register_post_type('products', array(
        'labels' => array(
            'name' => '产品',
            'singular_name' => '产品'
        ),
        'public' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'has_archive' => true
    ));
}
add_action('init', 'register_custom_post_types');

// 注册自定义分类法
function register_custom_taxonomies() {
    register_taxonomy('product_category', 'products', array(
        'labels' => array(
            'name' => '产品分类',
            'singular_name' => '产品分类'
        ),
        'hierarchical' => true,
        'show_in_rest' => true,
    ));
}
add_action('init', 'register_custom_taxonomies');

// 添加主题支持
function hannuo_theme_support() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
}
add_action('after_setup_theme', 'hannuo_theme_support');

// 添加脚本和样式
function hannuo_enqueue_scripts() {
    if (defined('WP_ENV') && WP_ENV === 'development') {
        wp_enqueue_script('vite-client', 'http://localhost:5173/@vite/client', array(), null, true);
        wp_enqueue_script('hannuo-main', 'http://localhost:5173/src/main.js', array(), null, true);
    } else {
        $manifest_path = get_template_directory() . '/dist/manifest.json';
        if (file_exists($manifest_path)) {
            $manifest = json_decode(file_get_contents($manifest_path), true);
            
            if (isset($manifest['src/main.js'])) {
                wp_enqueue_script(
                    'hannuo-main',
                    get_template_directory_uri() . '/dist/' . $manifest['src/main.js']['file'],
                    array(),
                    null,
                    true
                );

                if (isset($manifest['src/main.js']['css'])) {
                    foreach ($manifest['src/main.js']['css'] as $css) {
                        wp_enqueue_style(
                            'hannuo-style-' . basename($css),
                            get_template_directory_uri() . '/dist/' . $css
                        );
                    }
                }
            }
        }
    }
}
add_action('wp_enqueue_scripts', 'hannuo_enqueue_scripts');

// 确保ACF字段在REST API中可用
function add_acf_to_rest_api() {
    if (function_exists('acf_get_field_groups')) {
        $field_groups = acf_get_field_groups();
        foreach ($field_groups as $field_group) {
            error_log('Registering field group for REST API: ' . $field_group['title']);
            
            $fields = acf_get_fields($field_group);
            if ($fields) {
                foreach ($fields as $field) {
                    register_rest_field(
                        array('page', 'post', 'products'),
                        $field['name'],
                        array(
                            'get_callback' => function($object) use ($field) {
                                return get_field($field['name'], $object['id']);
                            }
                        )
                    );
                }
            }
        }
    }
}
add_action('rest_api_init', 'add_acf_to_rest_api');

// 添加ACF字段组调试
function debug_acf_field_groups() {
    if (function_exists('acf_get_field_groups')) {
        $field_groups = acf_get_field_groups();
        error_log('Available ACF field groups: ' . print_r($field_groups, true));
        
        // 检查联系我们页面
        $contact_page = get_page_by_path('contact');
        if ($contact_page) {
            error_log('Contact page found: ' . $contact_page->ID);
            $fields = get_fields($contact_page->ID);
            error_log('Fields for contact page: ' . print_r($fields, true));
        } else {
            error_log('Contact page not found');
        }
    }
}
add_action('init', 'debug_acf_field_groups');