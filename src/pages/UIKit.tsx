import Input from "../components/ui/Input/Input";
import Link from "../components/ui/Link/Link";

export default function UIKit() {
  return <div className="space-y-4">
    <Input name="email" id="email_id" className="w-full" value="Text field"/>
    <Input name="email" id="email_id" label="Email" className="w-full" error="Server error!" value="12345678"/>
    <Input name="password" type="password" id="password_id" label="Password" className="w-full" isViewSwitcher={true} value="12345678"/>
    <Link href="#" name="Link" />
    <Link href="#" name="Red link" className="underline text-red-500" />
    <Link href="#" name="Blue link" className="underline text-blue-500" />
    <Link href="#" name="Green link" className="underline text-green-500" />
  </div>;
}
