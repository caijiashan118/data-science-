import React from 'react'
import { Result, Button } from 'antd'
import { BugOutlined } from '@ant-design/icons'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px'
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <Result
              status="error"
              icon={<BugOutlined style={{ color: '#ff4d4f' }} />}
              title="页面出现错误"
              subTitle="抱歉，页面遇到了一个错误。请尝试刷新页面或返回首页。"
              extra={[
                <Button type="primary" key="reload" onClick={this.handleReload}>
                  刷新页面
                </Button>,
                <Button key="home" onClick={this.handleGoHome}>
                  返回首页
                </Button>,
              ]}
            />
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{ 
                marginTop: '20px', 
                padding: '16px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                <h4>错误详情（开发环境）：</h4>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary