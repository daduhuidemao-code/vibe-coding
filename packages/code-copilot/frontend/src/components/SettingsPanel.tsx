import { X, RefreshCw, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { providers } from '../services/providers';
import { AppSettings } from '../types';

/**
 * SettingsPanel 组件属性定义
 */
interface SettingsPanelProps {
  onClose: () => void;
}

/**
 * SettingsPanel 组件
 *
 * @description 设置面板组件，支持云服务商选择、API Key 配置、模型选择、AI 参数调整、编辑器设置等功能
 * @param {SettingsPanelProps} props - 组件属性
 */
export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const { settings, updateSettings } = useSettings();

  /**
   * 更新设置（泛型函数）
   *
   * @template K - AppSettings 的键类型
   * @param {K} key - 设置键名
   * @param {AppSettings[K]} value - 设置值
   */
  const handleChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    updateSettings({ [key]: value } as Partial<AppSettings>);
  };

  /**
   * 清除所有本地数据并刷新页面
   *
   * @description 清除 localStorage 中的配置、会话和聊天历史，然后刷新页面恢复默认状态
   */
  const handleClearData = () => {
    localStorage.removeItem('code-copilot-settings');
    localStorage.removeItem('code-copilot-session');
    localStorage.removeItem('code-copilot-chat-history');
    window.location.reload();
  };

  /**
   * 当前选择的云服务商配置
   */
  const currentProvider = providers.find((p) => p.id === settings.provider);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">设置</h2>
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-dark-400 mb-3">API 配置</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-dark-400 text-sm mb-1">云服务商</label>
                <select
                  value={settings.provider}
                  onChange={(e) => handleChange('provider', e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-accent-500"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-dark-400 text-sm mb-1">API Key</label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-dark-500 outline-none focus:border-accent-500 font-mono text-sm"
                />
              </div>

              {settings.provider === 'custom' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-dark-400 text-sm mb-1">自定义 API 地址</label>
                    <input
                      type="text"
                      value={settings.customBaseUrl}
                      onChange={(e) => handleChange('customBaseUrl', e.target.value)}
                      placeholder="https://api.example.com/v1"
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-dark-500 outline-none focus:border-accent-500"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-400 text-sm mb-1">
                      自定义模型（逗号分隔）
                    </label>
                    <input
                      type="text"
                      value={settings.customModels.join(',')}
                      onChange={(e) =>
                        handleChange(
                          'customModels',
                          e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                      placeholder="model-1, model-2"
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-dark-500 outline-none focus:border-accent-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-dark-400 text-sm mb-1">模型</label>
                <select
                  value={settings.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-accent-500"
                >
                  {(settings.provider === 'custom'
                    ? settings.customModels
                    : currentProvider?.models || []
                  ).map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-dark-400 mb-3">AI 参数</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-dark-400 text-sm mb-1">
                  温度 (Temperature): {settings.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                  className="w-full accent-accent-500"
                />
              </div>
              <div>
                <label className="block text-dark-400 text-sm mb-1">
                  最大 Token: {settings.maxTokens}
                </label>
                <input
                  type="range"
                  min="512"
                  max="8192"
                  step="512"
                  value={settings.maxTokens}
                  onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                  className="w-full accent-accent-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-dark-400 mb-3">编辑器设置</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-dark-400 text-sm mb-1">
                  字体大小: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                  className="w-full accent-accent-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-dark-700">
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <div className="text-sm text-red-300">
                <p className="font-medium mb-1">清除本地数据</p>
                <p className="text-xs text-red-400/70">这将清除所有配置、文件和聊天记录</p>
              </div>
            </div>
            <button
              onClick={handleClearData}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-dark-700 text-dark-400 rounded-lg hover:bg-dark-600 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重置所有数据</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
