"use client"

import { useContext } from 'react';
import AppModeContext from '@/context/appMode';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

export const description = "A radial chart with a custom shape"

// Update chartConfig to use users
const chartConfig = {
  users: {
    label: "Users", // Updated to Users
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface CountProps {
  users: number; // Updated prop type to users
}

export function Count({ users }: CountProps) {


    const modeContext = useContext(AppModeContext);
    if (!modeContext) {
        throw new Error('AppModeContextProvider is missing');
    }
    const { lightmode } = modeContext;
  return (
    <div   className={`min-w-[200px] max-w-[220px]  rounded-xl ${lightmode ? "bg-white text-black shadow-lg border-[1px]" : "bg-darkBg text-darkText border-[1px] border-darkBorder"}`}>
      <CardHeader className="items-center pb-0 mb-3">
        <CardTitle className="text-xl">Total Registration</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={[{ browser: "safari", users, fill: "var(--color-safari)" }]} // Updated to use users
            endAngle={100}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="bg-rose-200"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="users" background /> {/* Updated dataKey */}
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
                        className={`${lightmode ? "text-black" : "text-text"}`}
                        
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {users.toLocaleString()} {/* Updated to use users */}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Users {/* Changed to Users */}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
