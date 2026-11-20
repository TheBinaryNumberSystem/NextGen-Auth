import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const UserInfo = ({ user, label }) => {
  return (
    <Card className="w-full max-w-[600px] shadow-2xl border border-white/40 bg-white/95 backdrop-blur-xl rounded-2xl">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm gap-x-2">
          <p className="text-sm font-medium shrink-0">ID</p>
          <p className="text-xs font-mono p-1 bg-slate-100 rounded-md select-all break-all sm:break-normal">
            {user?.id}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm gap-x-2">
          <p className="text-sm font-medium shrink-0">Name</p>
          <p className="text-xs font-mono p-1 bg-slate-100 rounded-md select-all break-all sm:break-normal">
            {user?.name}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm gap-x-2">
          <p className="text-sm font-medium shrink-0">Email</p>
          <p className="text-xs font-mono p-1 bg-slate-100 rounded-md select-all break-all sm:break-normal">
            {user?.email}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm gap-x-2">
          <p className="text-sm font-medium shrink-0">Role</p>
          <p className="text-xs font-mono p-1 bg-slate-100 rounded-md select-all">
            {user?.role}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm gap-x-2">
          <p className="text-sm font-medium shrink-0">Two Factor Authentication</p>
          <Badge
            variant={user?.isTwoFactorEnabled ? "success" : "destructive"}
          >
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
