import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const InviteMemberSchema = z.object({
  email: z.email({error: "Email inválido!"}),
  role: z.string().default("SELLER"),
}).required()

export type InviteMemberType = z.infer<typeof InviteMemberSchema>;

export function InviteMemberWithEmailAndRole() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    resetField,
    control,
    formState: { errors },
  } = useForm<InviteMemberType>({ 
      resolver: zodResolver(InviteMemberSchema), 
      defaultValues: { role: "SELLER" }
    });

  const { ref: emailRef, ...emailRest } = register("email");
  const { ref: roleRef, ...roleRest } = register("role");

  const onsSubmit = async (data: InviteMemberType) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const organizationDomain = "finax-gi"
      const response = await api
        .post(`/organizations/${organizationDomain}/invites`, data)
        .finally(() => {
          setIsLoading(false);
          resetField("email");
        })

        console.log(response.data)

        setSuccess(true);  
    } catch (error) {
      setErrorMessage((error as any).response.data.message);
    }
  }

  if (errorMessage) {
    toast.error(errorMessage, { duration: 10000 })
  }

  return (
    <form 
      onSubmit={handleSubmit(onsSubmit)}
      noValidate
      className="space-y-2"
    >
      <div className="flex gap-2">
        <div className="space-y-1 flex-1">
          <Label>Email</Label>
          <Input
            placeholder="joao.silva@dominio.com"
            ref={emailRef}
            {...emailRest}
          />
        </div>
        <div className="space-y-1">
          <Label>Permissão</Label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SELLER">Vendedor</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <Button type="submit" className="w-full cursor-pointer" variant="outline">Enviar convite</Button>
    </form>
  )
}