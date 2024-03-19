"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { HiPaintBrush } from "react-icons/hi2";

const solids = [
  "#000000",
  "#FFFFFF",
  "#E2E2E2",
  "#FF0000",
  "#FF75C3",
  "#0000FF",
  "#FFA647",
  "#FFE83F",
  "#9FFF5B",
  "#70E2FF",
  "#CD93FF",
  "#09203F",
  "#00C9A7",
  "#4682B4",
  "#2E8B57",
  "#FDF5E6",
  "#FF00FF",
  "#F0E68C",
  "#40E0D0",
  "#800000",
  "#B0C4DE",
  "#FFEFD5",
  "#FF7F50",
  "#BDB76B",
  "#8B008B",
  "#778899",
  "#F0FFF0",
  "#FFB6C1",
  "#FFDEAD",
  "#6495ED",
  "#7B68EE",
  "#66CDAA",
];

type ColorPickerProps = React.ComponentProps<"input"> & {
  background: string;
  setBackground: (background: string) => void;
  className?: React.ComponentProps<"button">["className"];
};

export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ background, setBackground, className, disabled, ...props }, ref) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant={"outline"}
            className={cn(
              "block justify-start text-left font-normal w-full",
              !background && "text-muted-foreground",
              className
            )}
          >
            <div className="w-full flex items-center gap-2">
              {background ? (
                <div
                  className="size-4 rounded !bg-center !bg-cover transition-all border"
                  style={{ background }}
                />
              ) : (
                <HiPaintBrush className="size-4" />
              )}
              <div className="truncate flex-1">{background || "Pick a color"}</div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 flex flex-wrap gap-1 mt-0">
          {solids.map((solid) => (
            <div
              key={solid}
              style={{ background: solid }}
              className="rounded-md size-6 cursor-pointer active:scale-105 border shadow-md"
              onClick={() => setBackground(solid)}
            />
          ))}
          <Input
            id="custom"
            value={background}
            className="col-span-2 h-8 mt-4"
            placeholder="e.g. #FFFFFF"
            onChange={(e) => setBackground(e.currentTarget.value.toUpperCase())}
            ref={ref}
            {...props}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
