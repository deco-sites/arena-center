import Image from "apps/website/components/Image.tsx";

function UserIcon() {
  return (
    <>
      <label class="indicator text-secondary" aria-label="user-login">
        <span class="hidden indicator-item badge badge-primary badge-sm " />

        <a
          href="/entrar"
          class="btn btn-ghost no-animation  text-secondary hover:border-primary flex flex-col min-h-0 p-0 lg:px-2"
        >
          <Image
            src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/arena-center/010aaafd-ec04-488f-9efc-f752f22ffbcd/user.svg"
            alt="icone de usuario"
            width={20}
            height={20}
          />
          <p class="hidden lg:flex text-[10px] text-accent-content">
            Minha Conta
          </p>
        </a>
      </label>
    </>
  );
}

export default UserIcon;
