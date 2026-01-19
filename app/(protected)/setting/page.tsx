"use client";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal";
import { MessageCircle, IdCard, Home, AlertTriangle } from "lucide-react"
import SettingsNavigation from "./submenu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { openChatbot } from "@/components/common/chatbot";

export default function Page() {
  const { isOpen, openModal, closeModal } = useModal();
  const { data: session } = authClient.useSession();
  const [deleteEmail, setDeleteEmail] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [font, setFont] = React.useState<string>("");

  const fonts = [
    { value: "inter", label: "Inter" },
    { value: "manrope", label: "Manrope" },
    { value: "system", label: "System" },
  ];

  const handleDeleteUser = async () => {
    if (!session?.user) return;
    if (deleteEmail.trim() !== session.user.email) return;
    setIsDeleting(true);
    try {
      const { error } = await authClient.deleteUser();
      if (error) {
        console.error(error);
        toast.error("Failed to delete account. Please try again.");
        setIsDeleting(false);
        return;
      }
      window.location.href = "/";
    } catch (e) {
      toast.error("Failed to delete account. Please try again.");
      //console.error(e);
    } finally {
      closeModal();
      setIsDeleting(false);
    }
  }; 

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-auto md:space-y-2 md:overflow-hidden lg:flex-row lg:px-2 lg:space-y-0 lg:space-x-4">
      <SettingsNavigation />
      <div className="flex w-full overflow-y-scroll px-3 py-3 md:overflow-y-hidden">
        <div className="flex flex-1 flex-col">
          <div className="flex-none">
            <h3 className="text-lg font-medium">General</h3>
            <p className="text-muted-foreground text-sm">Settings and options for your application.</p>
          </div>
          <div
            data-orientation="horizontal"
            role="none"
            className="bg-border h-[1px] w-full mt-4 flex-none shadow-sm"
          ></div>
          <div dir="ltr" className="relative overflow-hidden faded-bottom flex-1 scroll-smooth md:pb-16">
            <div data-radix-scroll-area-viewport="" className="h-full w-full rounded-[inherit]">
              <div className="w-full">
                <div className="pt-4 w-full lg:max-w-full">
                  <div className="flex w-full flex-col items-start justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center">
                    <div className="flex flex-col items-start text-sm">
                      <p className="font-bold tracking-wide">Your application is currently on the free plan</p>
                      <p className="text-muted-foreground font-medium">
                        Paid plans offer higher usage limits, additional branches,and much more.Learn more{" "}
                        <a className="underline" href="">
                          here
                        </a>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={openChatbot} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border text-secondary-foreground shadow-xs hover:bg-secondary/80 h-9 px-4 py-2">
                        <MessageCircle className="size-4" />
                        Chat to us
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                        Upgrade
                      </button>
                    </div>
                  </div>
                  <form className="space-y-6 py-8">
                    <div className="space-y-2 flex flex-col items-start justify-between md:flex-row md:items-center">
                      <div>
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Company Logo
                        </label>
                        <p id=":r4b:-form-item-description" className="text-muted-foreground text-[0.8rem]">
                          Update your company logo.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm leading-[2.25rem]"
                          placeholder="Company Logo"
                          accept="image/webp,image/jpeg,image/png,image/svg+xml"
                          id=":r4b:-form-item"
                          aria-describedby=":r4b:-form-item-description"
                          aria-invalid="false"
                          type="file"
                          name="company_logo"
                        />
                      </div>
                    </div>
                    <div data-orientation="horizontal" role="none" className="bg-border shrink-0 h-[1px] w-full"></div>
                    <div className="space-y-2 flex flex-col items-start justify-between md:flex-row md:items-center">
                      <div>
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          System Font
                        </label>
                        <p id=":r4c:-form-item-description" className="text-muted-foreground text-[0.8rem]">
                          Set the font you want to use in the dashboard.
                        </p>
                      </div>
                      <div>
                        <Select value={font} onValueChange={(val) => setFont(val)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue
                              placeholder="Select Font"
                              aria-label={font ? fonts.find((f) => f.value === font)?.label : "Select Font"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {fonts.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                {f.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div data-orientation="horizontal" role="none" className="bg-border shrink-0 h-[1px] w-full"></div>
                    <div className="space-y-2 flex flex-col items-start justify-between md:flex-row md:items-center">
                      <div>
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Business Tax ID
                        </label>
                        <p id=":r4e:-form-item-description" className="text-muted-foreground text-[0.8rem]">
                          Tax ID of the company.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>
                          <input
                            className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            placeholder="Business Tax ID"
                            id=":r4e:-form-item"
                            aria-describedby=":r4e:-form-item-description"
                            aria-invalid="false"
                            name="company_tax_id"
                          />
                        </div>
                        <div className="inline-flex items-center rounded-md border px-2.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground py-2">
                          <IdCard className="size-4" />
                        </div>
                      </div>
                    </div>
                    <div data-orientation="horizontal" role="none" className="bg-border shrink-0 h-[1px] w-full"></div>
                    <div className="space-y-2 flex flex-col items-start justify-between md:flex-row md:items-center">
                      <div>
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Business Address
                        </label>
                        <p id=":r4f:-form-item-description" className="text-muted-foreground text-[0.8rem]">
                          Address of the company.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>
                          <input
                            className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full md:w-[200px] lg:w-[350px] rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            placeholder="Business Address"
                            id=":r4f:-form-item"
                            aria-describedby=":r4f:-form-item-description"
                            aria-invalid="false"
                            name="company_address"
                          />
                        </div>
                        <div className="inline-flex items-center rounded-md border px-2.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground py-2">
                          <Home className="size-4" />
                        </div>
                      </div>
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-9 px-4 py-2">
                      Save Changes
                    </button>
                  </form>
                  <div className="mt-10 mb-4 flex w-full flex-col items-start justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center">
                    <div className="flex flex-col items-start text-sm">
                      <p className="font-bold tracking-wide">Remove Account</p>
                      <p className="text-muted-foreground font-medium">
                        You can do 'Disable account' to take a break from panel.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={openModal}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 h-9 px-4 py-2"
                        type="button"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="flex flex-col space-y-2 text-center sm:text-left mb-3">
            <h2 id="radix-:r4h:" className="text-lg font-semibold">
              <div className="text-destructive flex items-center justify-center sm:justify-start gap-2">
                <AlertTriangle className="size-5 stroke-destructive" />
                <span className="leading-none">Deactivate</span>
              </div>
            </h2>
            <div id="radix-:r4i:" className="text-muted-foreground text-sm">
              <div className="space-y-4">
                <p className="mb-2">
                  Are you sure you want to delete the account
                  <br />
                  This action will remove the user with the role from the system. Please proceed with caution.
                </p>
                <div
                  role="alert"
                  className="relative w-full rounded-lg border mt-3 mb-3 p-4 text-sm border-destructive/50 text-destructive dark:border-destructive"
                >
                  <h5 className="mb-1 leading-none font-medium tracking-tight">Warning!</h5>
                  <div className="text-sm [&_p]:leading-relaxed">
                    Please be carefull, this operation can not be rolled back.
                  </div>
                </div>
                <label className="text-sm font-medium leading-none">
                  Email:
                  <input
                    className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Enter the email to confirm deactivation."
                    value={deleteEmail}
                    onChange={(e) => setDeleteEmail(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button
              onClick={closeModal}
              type="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 mt-2 sm:mt-0"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={
                isDeleting ||
                !session?.user ||
                deleteEmail.trim() !== session.user.email
              }
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 h-9 px-4 py-2 uppercase"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
