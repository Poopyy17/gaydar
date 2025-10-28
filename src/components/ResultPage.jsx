import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { Radar, RotateCcw, Home, TrendingUp, Sparkles, Heart } from 'lucide-react'
import { RadialBarChart, RadialBar, PolarRadiusAxis, Label } from 'recharts'
import { ChartContainer } from './ui/chart'
import confetti from 'canvas-confetti'

const ResultPage = ({ result, uploadedImage, onTryAgain }) => {
  useEffect(() => {
    // Fire confetti from left side
confetti({
        particleCount: 150,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: ['#60a5fa', '#3b82f6', '#8b5cf6', '#ec4899', '#f472b6']
      })
      confetti({
        particleCount: 150,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: ['#60a5fa', '#3b82f6', '#8b5cf6', '#ec4899', '#f472b6']
      })
  }, [])
  // Mock result data - you can customize this
  const gayPercentage = result?.percentage || Math.floor(Math.random() * 100)
  const resultMessage = gayPercentage > 70 
    ? "Sheeeesh confirmed badiiingg! 🌈"
    : gayPercentage > 40
    ? "Muntikan nang maging bading! ✨"
    : "Straight pero pwede pang bumaluktot~ 📏"

  // Chart data
  const chartData = [
    { 
      name: "gay", 
      value: gayPercentage,
      fill: "#60a5fa"
    }
  ]

  const chartConfig = {
    value: {
      label: "Gay",
    },
    gay: {
      label: "Gay",
      color: "#60a5fa",
    },
  }

  // Generate insights based on percentage
  const getInsights = () => {
    if (gayPercentage > 70) {
      return [
        { icon: Sparkles, text: "High confidence level detected", color: "text-primary" },
        { icon: Heart, text: "Strong bakla energy sensed", color: "text-primary" },
        { icon: TrendingUp, text: "Results indicate 85% bading accuracy", color: "text-primary" }
      ]
    } else if (gayPercentage > 40) {
      return [
        { icon: Sparkles, text: "Moderate signals detected", color: "text-yellow-500" },
        { icon: Heart, text: "Mixed bakla patterns identified", color: "text-yellow-500" },
        { icon: TrendingUp, text: "Results indicate 72% bading accuracy", color: "text-yellow-500" }
      ]
    } else {
      return [
        { icon: Sparkles, text: "Low confidence level detected", color: "text-blue-500" },
        { icon: Heart, text: "Straight energy patterns sensed", color: "text-blue-500" },
        { icon: TrendingUp, text: "Results indicate 78% bading accuracy", color: "text-blue-500" }
      ]
    }
  }

  const insights = getInsights()

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-background via-background to-muted/20 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto p-6 py-8">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Radar className="w-10 h-10 text-primary" />
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold rainbow-text pb-2">
              Analysis Complete!
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              {resultMessage}
            </p>
          </div>

          {/* Result Card */}
          <div className="w-full max-w-2xl mt-4">
            <div className="border-2 border-primary/20 rounded-3xl p-8 bg-background/50 backdrop-blur-sm shadow-lg">
              {/* Uploaded Image Preview */}
              {uploadedImage && (
                <div className="mb-6">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full max-w-[200px] mx-auto rounded-2xl border-2 border-border shadow-md object-contain" 
                  />
                </div>
              )}

              {/* Radial Chart */}
              <div className="flex justify-center mb-4">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square w-full max-w-[400px]"
                >
                  <RadialBarChart
                    data={chartData}
                    startAngle={90}
                    endAngle={90 + (gayPercentage * 3.6)}
                    innerRadius={120}
                    outerRadius={180}
                    width={400}
                    height={400}
                  >
                    <RadialBar
                      dataKey="value"
                      background={{ fill: "#1e293b" }}
                      cornerRadius={10}
                      fill="#60a5fa"
                    />
                    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-white text-6xl font-bold"
                                >
                                  {gayPercentage}%
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 36}
                                  className="fill-gray-400 text-sm"
                                >
                                  Gay
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </PolarRadiusAxis>
                  </RadialBarChart>
                </ChartContainer>
              </div>

              {/* Insights */}
              <div className="space-y-3 mt-4">
                <h3 className="text-lg font-semibold mb-4 text-center">Analysis Insights</h3>
                {insights.map((insight, index) => {
                  const Icon = insight.icon
                  return (
                    <div key={index} className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
                      <Icon className={`w-5 h-5 ${insight.color}`} />
                      <span className="text-sm">{insight.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-2xl pt-4">
            <Button
              variant="outline"
              size="lg"
              className="h-14 gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
              onClick={onTryAgain}
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </Button>
            <Button
              size="lg"
              className="h-14 gap-2 transition-all duration-300 bg-white"
              onClick={onTryAgain}
            >
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultPage
