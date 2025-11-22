/**
 * 京东Cookie自动提交脚本
 * @author 你的名字
 * @date 2025-11-22
 * 适用于: Quantumult X 和 Loon
 */

const API_URL = "http://rrror.top:9988/api/jd/submit_ck";
const SCRIPT_NAME = "京东Cookie";
const COOKIE_KEY = "jdck_last_cookie";

// ==================== 工具函数 ====================
function log(msg) {
    console.log(`[${SCRIPT_NAME}] ${msg}`);
}

function notify(title, subtitle, content) {
    log(`${title} - ${subtitle}: ${content}`);
    if (typeof $notification !== 'undefined') {
        $notification.post(title, subtitle, content);
    }
}

// 提取京东Cookie
function extractCookie(cookieStr) {
    try {
        const ptKey = cookieStr.match(/pt_key=([^;]+)/);
        const ptPin = cookieStr.match(/pt_pin=([^;]+)/);

        if (!ptKey || !ptPin) {
            return null;
        }

        return `pt_key=${ptKey[1]};pt_pin=${ptPin[1]};`;
    } catch (e) {
        log(`提取Cookie失败: ${e}`);
        return null;
    }
}

// 获取持久化数据
function getData(key) {
    if (typeof $prefs !== 'undefined') {
        return $prefs.valueForKey(key);
    } else if (typeof $persistentStore !== 'undefined') {
        return $persistentStore.read(key);
    }
    return null;
}

// 保存持久化数据
function setData(key, val) {
    if (typeof $prefs !== 'undefined') {
        return $prefs.setValueForKey(val, key);
    } else if (typeof $persistentStore !== 'undefined') {
        return $persistentStore.write(val, key);
    }
    return false;
}

// HTTP POST请求
function httpPost(url, data) {
    return new Promise((resolve, reject) => {
        const options = {
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
            },
            body: JSON.stringify(data)
        };

        // Quantumult X
        if (typeof $task !== 'undefined') {
            options.method = 'POST';
            $task.fetch(options).then(res => {
                try {
                    resolve(JSON.parse(res.body));
                } catch (e) {
                    reject(`解析失败: ${e}`);
                }
            }).catch(reject);
        }
        // Loon
        else if (typeof $loon !== 'undefined') {
            options.method = 'POST';
            $loon.http(options, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        reject(`解析失败: ${e}`);
                    }
                }
            });
        }
        // Surge / Shadowrocket
        else if (typeof $httpClient !== 'undefined') {
            $httpClient.post(options, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        reject(`解析失败: ${e}`);
                    }
                }
            });
        } else {
            reject('不支持的平台');
        }
    });
}

// ==================== 主函数 ====================
async function main() {
    try {
        log('开始执行...');

        // 获取Cookie
        const cookieStr = $request.headers['Cookie'] || $request.headers['cookie'] || '';
        if (!cookieStr) {
            log('未获取到Cookie');
            $done({});
            return;
        }

        // 提取pt_key和pt_pin
        const jdCookie = extractCookie(cookieStr);
        if (!jdCookie) {
            log('Cookie格式错误');
            $done({});
            return;
        }

        log('提取Cookie成功');

        // 检查是否重复
        const lastCookie = getData(COOKIE_KEY);
        if (lastCookie === jdCookie) {
            log('Cookie未变化，跳过');
            $done({});
            return;
        }

        // 提交到API
        log(`提交到: ${API_URL}`);
        const result = await httpPost(API_URL, { cookie: jdCookie });

        log(`API返回: ${result.code} - ${result.message}`);

        if (result.code === 200) {
            const data = result.data || {};
            const msg = `账号: ${data.jdpin || '未知'}\n昵称: ${data.jdname || '未知'}\n青龙: ${data.ql_sync ? '✅' : '❌'}`;
            notify(SCRIPT_NAME, data.is_new ? '新增成功' : '更新成功', msg);
            setData(COOKIE_KEY, jdCookie);
            log('✅ 提交成功');
        } else {
            notify(SCRIPT_NAME, '提交失败', result.message || '未知错误');
            log(`❌ 失败: ${result.message}`);
        }

    } catch (e) {
        log(`异常: ${e}`);
        notify(SCRIPT_NAME, '执行异常', String(e));
    } finally {
        $done({});
    }
}

// 启动
main();
