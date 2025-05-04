import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, ThumbsUp, Award, HelpCircle, FileQuestion, Check, Star, Users, Trophy } from "lucide-react"

export function PointAllocationExplainer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-primary/10 cosmic-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileQuestion className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Asking Questions</h3>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FileQuestion className="h-4 w-4 text-muted-foreground" />
                <span>Posting a question</span>
              </div>
              <span className="font-medium">+5 points</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                <span>Question upvoted</span>
              </div>
              <span className="font-medium">+2 points</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-muted-foreground" />
                <span>Question marked as solved</span>
              </div>
              <span className="font-medium">+3 points</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span>Featured question</span>
              </div>
              <span className="font-medium">+10 points</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary/10 cosmic-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Answering Questions</h3>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>Posting an answer</span>
              </div>
              <span className="font-medium">+5 points</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                <span>Answer upvoted</span>
              </div>
              <span className="font-medium">+5 points</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>Answer accepted</span>
              </div>
              <span className="font-medium">+25 points</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span>Detailed explanation</span>
              </div>
              <span className="font-medium">+10 points</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary/10 cosmic-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Community Engagement</h3>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Daily login streak</span>
              </div>
              <span className="font-medium">+1 point/day</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span>Weekly challenge completed</span>
              </div>
              <span className="font-medium">+20 points</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span>Editing/improving posts</span>
              </div>
              <span className="font-medium">+2 points</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>Receiving badges</span>
              </div>
              <span className="font-medium">+5-50 points</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
