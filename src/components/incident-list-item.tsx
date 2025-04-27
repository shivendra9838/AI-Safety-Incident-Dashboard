import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Incident } from "@/types/incident";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { SeverityBadge } from "./severity-badge";
import { motion, AnimatePresence } from "framer-motion";

interface IncidentListItemProps {
  incident: Incident;
}

export function IncidentListItem({ incident }: IncidentListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100 tracking-tight">
              {incident.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <SeverityBadge severity={incident.severity} />
              <span className="font-medium">
                {format(new Date(incident.reportedAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
            <span className="sr-only">
              {isExpanded ? "Show less" : "Show more"}
            </span>
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CardContent className="pt-0 pb-4 px-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {incident.description}
              </p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}