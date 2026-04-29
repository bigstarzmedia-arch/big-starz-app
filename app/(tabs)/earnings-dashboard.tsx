import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  subscriberCount: number;
  castingFeesEnabled: boolean;
  castingFeeAmount: number;
  pendingPayouts: number;
}

interface PayoutTransaction {
  id: number;
  amount: number;
  date: Date;
  status: "pending" | "completed" | "failed";
  stripeTransferId: string;
}

/**
 * Earnings Dashboard Screen
 * Display 1k subscriber progress bar, casting fees, and Stripe payout history
 */
export default function EarningsDashboardScreen() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [payouts, setPayouts] = useState<PayoutTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEarningsData();
  }, []);

  const loadEarningsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Fetch earnings from API
      // const response = await fetch("/api/trpc/earnings.getStatus");
      // const { result } = await response.json();
      // setEarnings(result.data);

      // Mock data
      setEarnings({
        totalEarnings: 4250.5,
        monthlyEarnings: 850.0,
        subscriberCount: 847,
        castingFeesEnabled: false,
        castingFeeAmount: 0,
        pendingPayouts: 250.0,
      });

      setPayouts([
        {
          id: 1,
          amount: 500.0,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: "completed",
          stripeTransferId: "tr_1234567890",
        },
        {
          id: 2,
          amount: 350.0,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          status: "completed",
          stripeTransferId: "tr_0987654321",
        },
        {
          id: 3,
          amount: 250.0,
          date: new Date(),
          status: "pending",
          stripeTransferId: "tr_pending123",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load earnings");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#D4AF37" />
      </ScreenContainer>
    );
  }

  if (!earnings) {
    return (
      <ScreenContainer className="bg-background justify-center items-center">
        <Text className="text-foreground">No earnings data available</Text>
      </ScreenContainer>
    );
  }

  const subscriberPercentage = Math.min((earnings.subscriberCount / 1000) * 100, 100);
  const hasReachedThousand = earnings.subscriberCount >= 1000;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-6 gap-6">
          {/* Header */}
          <View>
            <Text className="text-2xl font-bold text-foreground">
              Earnings Dashboard
            </Text>
            <Text className="text-sm text-muted mt-1">
              Track your monetization and payouts
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-error/10 border border-error rounded-lg p-4">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          )}

          {/* Total Earnings Card */}
          <View className="bg-primary/10 border border-primary rounded-lg p-6 gap-2">
            <Text className="text-sm text-muted">Total Earnings</Text>
            <Text className="text-4xl font-bold text-primary">
              ${earnings.totalEarnings.toFixed(2)}
            </Text>
            <Text className="text-xs text-muted mt-2">
              This month: ${earnings.monthlyEarnings.toFixed(2)}
            </Text>
          </View>

          {/* 1k Subscriber Gate */}
          <View className="bg-surface border border-border rounded-lg p-6 gap-4">
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="font-semibold text-foreground">
                  Subscriber Milestone
                </Text>
                <Text className="text-sm font-bold text-primary">
                  {earnings.subscriberCount} / 1,000
                </Text>
              </View>
              <Text className="text-xs text-muted">
                Unlock casting fees at 1,000 subscribers
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="bg-surface border border-border rounded-full h-3 overflow-hidden">
              <View
                className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full"
                style={{ width: `${subscriberPercentage}%` }}
              />
            </View>

            {/* Milestone Status */}
            {hasReachedThousand ? (
              <View className="bg-success/10 border border-success rounded-lg p-3">
                <Text className="text-success font-semibold text-sm">
                  🎉 Congratulations! You've unlocked casting fees!
                </Text>
              </View>
            ) : (
              <View className="bg-warning/10 border border-warning rounded-lg p-3">
                <Text className="text-warning font-semibold text-sm">
                  {1000 - earnings.subscriberCount} subscribers until casting fees unlock
                </Text>
              </View>
            )}
          </View>

          {/* Casting Fees Section */}
          {hasReachedThousand && (
            <View className="bg-surface border border-border rounded-lg p-6 gap-4">
              <View className="gap-2">
                <Text className="font-semibold text-foreground">
                  Casting Fee Configuration
                </Text>
                <Text className="text-xs text-muted">
                  Set your rate for casting opportunities
                </Text>
              </View>

              <View className="bg-background rounded-lg p-4 border border-border">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-sm text-muted">Current Rate</Text>
                  <Text className="text-2xl font-bold text-primary">
                    ${earnings.castingFeeAmount.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity className="bg-primary rounded-lg py-3 active:scale-95">
                  <Text className="text-center text-background font-bold">
                    Edit Rate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Pending Payouts */}
          {earnings.pendingPayouts > 0 && (
            <View className="bg-warning/10 border border-warning rounded-lg p-4 gap-2">
              <Text className="font-semibold text-warning">Pending Payout</Text>
              <Text className="text-2xl font-bold text-warning">
                ${earnings.pendingPayouts.toFixed(2)}
              </Text>
              <Text className="text-xs text-muted mt-1">
                Processing to your Stripe account
              </Text>
            </View>
          )}

          {/* Payout History */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="font-semibold text-foreground">
                Payout History
              </Text>
              <TouchableOpacity>
                <Text className="text-xs text-primary font-semibold">
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={payouts}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <PayoutCard transaction={item} />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

/**
 * Payout Transaction Card Component
 */
function PayoutCard({ transaction }: { transaction: PayoutTransaction }) {
  const statusColors = {
    completed: { bg: "bg-success/10", text: "text-success", label: "Completed" },
    pending: { bg: "bg-warning/10", text: "text-warning", label: "Pending" },
    failed: { bg: "bg-error/10", text: "text-error", label: "Failed" },
  };

  const colors = statusColors[transaction.status];
  const formattedDate = transaction.date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View className="bg-surface border border-border rounded-lg p-4 mb-3 flex-row justify-between items-center">
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-semibold text-foreground">
            ${transaction.amount.toFixed(2)}
          </Text>
          <View className={`${colors.bg} px-2 py-1 rounded`}>
            <Text className={`text-xs font-semibold ${colors.text}`}>
              {colors.label}
            </Text>
          </View>
        </View>
        <Text className="text-xs text-muted">{formattedDate}</Text>
        <Text className="text-xs text-muted opacity-70">
          {transaction.stripeTransferId}
        </Text>
      </View>
      <TouchableOpacity className="ml-4">
        <Text className="text-primary text-xs font-semibold">Details</Text>
      </TouchableOpacity>
    </View>
  );
}
