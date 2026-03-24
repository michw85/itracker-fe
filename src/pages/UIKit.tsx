import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Avatar, AvatarBadge, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Plus, Trash2, Trash2Icon, TriangleAlert } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { CustomCheckbox, CustomInput } from "../components/shared";

export default function UIKit() {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-semibold tracking-tight">Input</h3>
      <CustomInput />
      <CustomInput label="Email" />
      <CustomInput label="Name" error="Error" />
      <CustomInput
        label="Name"
        placeholder="Entry your name"
        defaultValue="Vitalii"
      />
      <CustomInput
        type="password"
        label="Password"
        name="password"
        id="id_password"
        placeholder="Entry password"
        required
        isViewSwitcher
        description="The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      />

      <h3 className="text-3xl font-semibold tracking-tight">Button</h3>
      <Separator className="mb-10" />
      <Button size="lg">Default</Button>
      <Button>Default</Button>
      <Button size="sm">Default</Button>
      <Button size="xs">Default</Button>
      <br />
      <Button variant="link" size="lg">
        Link
      </Button>
      <Button variant="link">Link</Button>
      <Button variant="link" size="sm">
        Link
      </Button>
      <Button variant="link" size="xs">
        Link
      </Button>
      <br />
      <Button variant="destructive" size="lg">
        destructive
      </Button>
      <Button variant="destructive">destructive</Button>
      <Button variant="destructive" size="sm">
        destructive
      </Button>
      <Button variant="destructive" size="xs">
        destructive
      </Button>
      <br />
      <Button variant="outline" size="lg">
        Outline
      </Button>
      <Button variant="outline">Outline</Button>
      <Button variant="outline" size="sm">
        Outline
      </Button>
      <Button variant="outline" size="xs">
        Outline
      </Button>
      <br />
      <Button variant="secondary">Secondary</Button>
      <br />
      <Button variant="ghost">Ghost</Button>
      <br />
      <Button size="icon">
        <Trash2 />
      </Button>
      <Button size="icon" variant="outline">
        <Plus />
      </Button>
      <Button size="icon" variant="destructive">
        <TriangleAlert />
      </Button>
      <a href="https://lucide.dev/icons/" className="hover:underline" target="_blank">Icons</a>

      <h3 className="text-3xl font-semibold tracking-tight">Checkbox</h3>
      <Separator className="mb-10" />
      <CustomCheckbox id="checkbox_1" />
      <CustomCheckbox id="checkbox_1" checked />
      <CustomCheckbox
        id="checkbox_2"
        name="checkbox_2"
        label="Terms and conditions"
      />
      <CustomCheckbox
        id="checkbox_3"
        name="checkbox_3"
        label="Terms and conditions"
        description="Mandatory conditions"
      />
      <CustomCheckbox
        id="checkbox_3"
        name="checkbox_3"
        label="Terms and conditions"
        description="Mandatory conditions"
        error
      />

      <h3 className="text-3xl font-semibold tracking-tight">Badge</h3>
      <Separator className="mb-10" />
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>

      <h3 className="text-3xl font-semibold tracking-tight">Alert Dialog</h3>
      <Separator className="mb-10" />
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline">Show Dialog</Button>}
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant={undefined} size={undefined}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="destructive">Delete Chat</Button>}
        />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat conversation. View{" "}
              <a href="#">Settings</a> delete any memories saved during this
              chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" size={undefined}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <h3 className="text-3xl font-semibold tracking-tight">Avatar</h3>
      <Separator className="mb-10" />
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
      </Avatar>

      <h3 className="text-3xl font-semibold tracking-tight">Card</h3>
      <Separator className="mb-10" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <CustomInput
                label="Email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <CustomInput
                label="Password"
                id="password"
                type="password"
                required
                isViewSwitcher
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
