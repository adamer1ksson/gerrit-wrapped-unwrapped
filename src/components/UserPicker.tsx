import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { users } from "@/data/wrapped";

export function UserPicker({ value }: { value?: string }) {
  const navigate = useNavigate();

  return (
    <Select
      value={value ?? ""}
      onValueChange={(name) => navigate({ to: "/u/$user", params: { user: name } })}
    >
      <SelectTrigger className="h-12 w-full rounded-full border-white/15 bg-white/10 px-5 text-base font-semibold text-foreground backdrop-blur">
        <SelectValue placeholder="Pick someone's Wrapped" />
      </SelectTrigger>
      <SelectContent className="rounded-2xl">
        {users.map((u) => (
          <SelectItem key={u.name} value={u.name} className="text-base">
            {u.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
