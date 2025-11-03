import Link from "next/link"
import { server } from "../../config";
import { useGlobalContext } from "../../Contexts/globalContext/context";
import {useRouter} from "next/router";
import {
  PlusIcon,
  EyeIcon,
  ClipboardListIcon,
  UserAddIcon,
  LogoutIcon,
} from "@heroicons/react/outline";

export default function AdminNav() {
    const {setDisplayProf,updateAccount} = useGlobalContext();
    const router = useRouter();

    const loggingOut = async () => {
        const result = await fetch(`${server}/api/auth/admin`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await result.json();
        setDisplayProf(false);
        console.log(data);
        if (data.message == "loged out") {
          updateAccount({});
          router.push("/admin/login");
        }
      };

    return(
        <section className="mt-[10px] px-5 bg-secondary border-t-[1px] border-b-[1px] border-hovercont text-primary text-sm">
            <div className="max-w-7xl mx-auto">
                <ul className="flex flex-row justify-between items-center py-4">
                    <div className="flex flex-row justify-start gap-x-6">
                        <li className="flex items-center px-4 py-2 rounded-lg hover:bg-third hover:text-accent transition-all duration-200 cursor-pointer">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            <Link href="/admin/product/create"><a>New Product</a></Link>
                        </li>
                        <li className="flex items-center px-4 py-2 rounded-lg hover:bg-third hover:text-accent transition-all duration-200 cursor-pointer">
                            <EyeIcon className="w-5 h-5 mr-2" />
                            <Link href="/admin/product/hat"><a>Display Products</a></Link>
                        </li>
                        <li className="flex items-center px-4 py-2 rounded-lg hover:bg-third hover:text-accent transition-all duration-200 cursor-pointer">
                            <ClipboardListIcon className="w-5 h-5 mr-2" />
                            <Link href="/admin/order"><a>Orders</a></Link>
                        </li>
                    </div>
                    <div className="flex flex-row justify-end gap-x-6">
                        <li className="flex items-center px-4 py-2 rounded-lg hover:bg-third hover:text-accent transition-all duration-200 cursor-pointer">
                            <UserAddIcon className="w-5 h-5 mr-2" />
                            <Link href="/admin/signup"><a>Signup New Admin</a></Link>
                        </li>
                        <li className="flex items-center px-4 py-2 rounded-lg hover:bg-danger hover:text-white transition-all duration-200 cursor-pointer" onClick={()=>loggingOut()}>
                            <LogoutIcon className="w-5 h-5 mr-2" />
                            Log Out
                        </li>
                    </div>
                </ul>
            </div>
        </section>
    )
}
