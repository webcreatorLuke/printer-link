import React, { useState, useEffect } from 'react';
import { Activity, Thermometer, Zap, Wifi, WifiOff, Power, Pause, Play, Square } from 'lucide-react';

export default function PrinterControl() {
  const [printerIP, setPrinterIP] = useState('');
  const [connected, setConnected] = useState(false);
  const [printerData, setPrinterData] = useState({
    hotendTemp: 0,
    hotendTarget: 0,
    bedTemp: 0,
    bedTarget: 0,
    progress: 0,
    status: 'idle',
    fileName: ''
  });
  const [connectionError, setConnectionError] = useState('');

  // Simulate printer connection and data polling
  const connectToPrinter = async () => {
    if (!printerIP) {
      setConnectionError('Please enter a valid IP address');
      return;
    }

    try {
      // In a real implementation, this would make an actual API call to the printer
      // Example: const response = await fetch(`http://${printerIP}/api/printer`);
      
      setConnectionError('');
      setConnected(true);
      
      // Simulate receiving printer data
      startDataPolling();
    } catch (error) {
      setConnectionError('Failed to connect. Check IP and network.');
      setConnected(false);
    }
  };

  const startDataPolling = () => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setPrinterData(prev => ({
        hotendTemp: Math.min(prev.hotendTarget, prev.hotendTemp + Math.random() * 5),
        hotendTarget: 210,
        bedTemp: Math.min(prev.bedTarget, prev.bedTemp + Math.random() * 3),
        bedTarget: 60,
        progress: prev.progress < 100 ? prev.progress + 0.5 : 100,
        status: prev.progress >= 100 ? 'complete' : 'printing',
        fileName: 'test_print.gcode'
      }));
    }, 1000);

    return () => clearInterval(interval);
  };

  const disconnect = () => {
    setConnected(false);
    setPrinterData({
      hotendTemp: 0,
      hotendTarget: 0,
      bedTemp: 0,
      bedTarget: 0,
      progress: 0,
      status: 'idle',
      fileName: ''
    });
  };

  const sendCommand = (command) => {
    console.log(`Sending command: ${command}`);
    // In real implementation: fetch(`http://${printerIP}/api/printer/command`, ...)
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Orbitron:wght@700;900&display=swap');
        
        body {
          font-family: 'JetBrains Mono', monospace;
        }
        
        .title-font {
          font-family: 'Orbitron', sans-serif;
        }
        
        .scanner-line {
          animation: scan 2s linear infinite;
        }
        
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.3; }
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.6); }
        }
        
        .connection-grid {
          background-image: 
            linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .metric-card {
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(249, 115, 22, 0.2);
        }
        
        .temp-bar {
          transition: width 0.5s ease-out;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="title-font text-5xl font-black text-orange-500 tracking-wider">
            PRINT_CONTROL
          </h1>
          <div className="flex items-center gap-3">
            {connected ? (
              <>
                <Wifi className="w-6 h-6 text-green-500" />
                <span className="text-green-500 text-sm font-semibold">ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-6 h-6 text-zinc-600" />
                <span className="text-zinc-600 text-sm font-semibold">OFFLINE</span>
              </>
            )}
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {!connected ? (
          /* Connection Panel */
          <div className="relative">
            <div className="connection-grid absolute inset-0 rounded-2xl"></div>
            <div className="relative bg-zinc-900/80 border-2 border-orange-500/30 rounded-2xl p-12">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <Activity className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h2 className="title-font text-3xl font-bold text-orange-500 mb-2">
                    NETWORK CONNECTION
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Enter your 3D printer's local IP address to establish connection
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-3 tracking-wider">
                      PRINTER IP ADDRESS
                    </label>
                    <input
                      type="text"
                      value={printerIP}
                      onChange={(e) => setPrinterIP(e.target.value)}
                      placeholder="192.168.1.100"
                      className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-orange-500 rounded-lg px-6 py-4 text-lg text-zinc-100 placeholder-zinc-600 transition-all outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && connectToPrinter()}
                    />
                  </div>

                  {connectionError && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                      <p className="text-red-400 text-sm">{connectionError}</p>
                    </div>
                  )}

                  <button
                    onClick={connectToPrinter}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20"
                  >
                    ESTABLISH CONNECTION
                  </button>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mt-8">
                    <h3 className="text-orange-500 font-bold mb-3 text-sm tracking-wider">
                      SUPPORTED PROTOCOLS
                    </h3>
                    <ul className="text-zinc-400 text-xs space-y-2">
                      <li>• OctoPrint REST API</li>
                      <li>• Klipper Moonraker API</li>
                      <li>• Marlin/RepRap Firmware</li>
                      <li>• Custom HTTP endpoints</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Control Dashboard */
          <div className="space-y-6">
            {/* Status Bar */}
            <div className="bg-zinc-900/80 border-2 border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full pulse-glow"></div>
                  <div>
                    <div className="text-sm text-zinc-400">STATUS</div>
                    <div className="text-xl font-bold text-orange-500 uppercase">
                      {printerData.status}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mx-8">
                  <div className="text-sm text-zinc-400 mb-2">{printerData.fileName}</div>
                  <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="temp-bar absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-amber-500"
                      style={{ width: `${printerData.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-orange-500 font-bold mt-1">
                    {printerData.progress.toFixed(1)}%
                  </div>
                </div>

                <button
                  onClick={disconnect}
                  className="bg-zinc-800 hover:bg-red-900/30 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-red-400 px-6 py-2 rounded-lg transition-all text-sm font-semibold"
                >
                  DISCONNECT
                </button>
              </div>
            </div>

            {/* Temperature Monitors */}
            <div className="grid grid-cols-2 gap-6">
              {/* Hotend Temperature */}
              <div className="metric-card bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-6 h-6 text-orange-500" />
                    <span className="text-sm font-bold text-zinc-400 tracking-wider">
                      HOTEND
                    </span>
                  </div>
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-orange-500">
                        {printerData.hotendTemp.toFixed(1)}
                      </span>
                      <span className="text-xl text-zinc-500">°C</span>
                    </div>
                    <div className="text-sm text-zinc-500 mt-1">
                      Target: {printerData.hotendTarget}°C
                    </div>
                  </div>
                  
                  <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="temp-bar absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 to-red-500"
                      style={{ width: `${(printerData.hotendTemp / printerData.hotendTarget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Bed Temperature */}
              <div className="metric-card bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-6 h-6 text-amber-500" />
                    <span className="text-sm font-bold text-zinc-400 tracking-wider">
                      BED
                    </span>
                  </div>
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-amber-500">
                        {printerData.bedTemp.toFixed(1)}
                      </span>
                      <span className="text-xl text-zinc-500">°C</span>
                    </div>
                    <div className="text-sm text-zinc-500 mt-1">
                      Target: {printerData.bedTarget}°C
                    </div>
                  </div>
                  
                  <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="temp-bar absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 to-orange-500"
                      style={{ width: `${(printerData.bedTemp / printerData.bedTarget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-zinc-400 tracking-wider mb-4">
                PRINT CONTROLS
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => sendCommand('pause')}
                  className="bg-zinc-800 hover:bg-yellow-900/30 border border-zinc-700 hover:border-yellow-500 text-zinc-300 hover:text-yellow-400 py-4 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <Pause className="w-5 h-5" />
                  PAUSE
                </button>
                
                <button
                  onClick={() => sendCommand('resume')}
                  className="bg-zinc-800 hover:bg-green-900/30 border border-zinc-700 hover:border-green-500 text-zinc-300 hover:text-green-400 py-4 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <Play className="w-5 h-5" />
                  RESUME
                </button>
                
                <button
                  onClick={() => sendCommand('cancel')}
                  className="bg-zinc-800 hover:bg-red-900/30 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-red-400 py-4 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <Square className="w-5 h-5" />
                  CANCEL
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-xs text-zinc-500 mb-1">CONNECTION</div>
                  <div className="text-orange-500 font-bold">{printerIP}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 mb-1">PROTOCOL</div>
                  <div className="text-orange-500 font-bold">REST API</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 mb-1">LATENCY</div>
                  <div className="text-green-500 font-bold">12ms</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <div className="text-xs text-zinc-700 font-semibold tracking-wider">
          REMOTE FABRICATION CONTROL SYSTEM v2.0
        </div>
      </div>
    </div>
  );
}
