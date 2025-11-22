/**
 * 京东Cookie自动提交脚本
 * @author rkuhua
 * @date 2025-11-22
 * 适用于: Quantumult X 和 Loon
 */

const API_URL = "http://rrror.top:9988/api/jd/submit_ck";
const SCRIPT_NAME = "京东Cookie";
const COOKIE_KEY = "jdck_last_cookie";

// ==================== 主逻辑 ====================
let cookie = $request.headers['Cookie'] || $request.headers['cookie'];

if (!cookie) {
    console.log('[京东Cookie] 未获取到Cookie');
    $done({});
} else {
    // 提取pt_key和pt_pin
    let ptKeyMatch = cookie.match(/pt_key=([^;]+)/);
    let ptPinMatch = cookie.match(/pt_pin=([^;]+)/);

    if (ptKeyMatch && ptPinMatch) {
        let pt_key = ptKeyMatch[1];
        let pt_pin = ptPinMatch[1];
        let jdCookie = `pt_key=${pt_key};pt_pin=${pt_pin};`;

        console.log('[京东Cookie] 提取成功');
        console.log(`[京东Cookie] PIN: ${pt_pin}`);

        // 检查是否重复
        let lastCookie = getData(COOKIE_KEY);
        if (lastCookie === jdCookie) {
            console.log('[京东Cookie] Cookie未变化，跳过提交');
            $done({});
        } else {
            // 提交到API
            console.log(`[京东Cookie] 提交到: ${API_URL}`);
            submitToAPI(jdCookie, pt_pin);
        }
    } else {
        console.log('[京东Cookie] Cookie格式错误');
        $done({});
    }
}

// ==================== 获取持久化数据 ====================
function getData(key) {
    if (typeof $prefs !== 'undefined') {
        return $prefs.valueForKey(key);
    } else if (typeof $persistentStore !== 'undefined') {
        return $persistentStore.read(key);
    }
    return null;
}

// ==================== 保存持久化数据 ====================
function setData(key, val) {
    if (typeof $prefs !== 'undefined') {
        return $prefs.setValueForKey(val, key);
    } else if (typeof $persistentStore !== 'undefined') {
        return $persistentStore.write(val, key);
    }
    return false;
}

// ==================== 提交到API ====================
function submitToAPI(cookie, pt_pin) {
    const options = {
        url: API_URL,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
        },
        body: JSON.stringify({ cookie: cookie })
    };

    console.log(`[京东Cookie] 正在提交...`);

    // 兼容多个平台
    if (typeof $httpClient !== 'undefined') {
        // Surge / Loon / Shadowrocket
        $httpClient.post(options, function (error, response, data) {
            handleAPIResponse(error, response, data, cookie, pt_pin);
        });
    } else if (typeof $task !== 'undefined') {
        // Quantumult X
        options.method = 'POST';
        $task.fetch(options).then(response => {
            handleAPIResponse(null, response, response.body, cookie, pt_pin);
        }, reason => {
            handleAPIResponse(reason.error, null, null, cookie, pt_pin);
        });
    } else {
        console.log('[京东Cookie] 不支持的平台');
        $done({});
    }
}

// ==================== 处理API返回 ====================
function handleAPIResponse(error, response, data, cookie, pt_pin) {
    if (error) {
        console.log(`[京东Cookie] ❌ API提交失败: ${error}`);
        notify('京东Cookie', '提交失败', `网络错误: ${error}`);
        $done({});
        return;
    }

    try {
        const result = JSON.parse(data);
        console.log(`[京东Cookie] API返回: ${result.code} - ${result.message}`);

        if (result.code === 200) {
            const info = result.data || {};
            const msg = `账号: ${info.jdpin || pt_pin}\n昵称: ${info.jdname || '未知'}\n青龙: ${info.ql_sync ? '✅成功' : '❌失败'}`;
            notify('京东Cookie', info.is_new ? '新增成功 ✅' : '更新成功 ✅', msg);

            // 保存Cookie，避免重复提交
            setData(COOKIE_KEY, cookie);
            console.log('[京东Cookie] ✅ 提交成功');
        } else {
            notify('京东Cookie', '提交失败 ❌', result.message || '未知错误');
            console.log(`[京东Cookie] ❌ 失败: ${result.message}`);
        }
    } catch (e) {
        console.log(`[京东Cookie] ❌ 解析返回失败: ${e}`);
        notify('京东Cookie', '解析失败', '无法解析API返回数据');
    }

    $done({});
}

// ==================== 通知 ====================
function notify(title, subtitle, content) {
    console.log(`[${title}] ${subtitle}: ${content}`);

    if (typeof $notification !== 'undefined') {
        $notification.post(title, subtitle, content);
    } else if (typeof $notify !== 'undefined') {
        $notify(title, subtitle, content);
    }
}
