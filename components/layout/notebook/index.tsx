import type * as PageTree from "fumadocs-core/page-tree";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import { GitHubLogo } from "icons/general";
import { Languages, Sidebar as SidebarIcon, X } from "lucide-react";
import Link from "next/link";
import {
  type ComponentProps,
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
} from "react";
import { cn } from "../../../lib/cn";
import { buttonVariants } from "../../ui/button";
import { LanguageToggle } from "../language-toggle";
import { LinkItem, type LinkItemType } from "../link-item";
import { SearchToggle } from "../search-toggle";
import {
  type BaseLayoutProps,
  renderTitleNav,
  resolveLinkItems,
} from "../shared";
import type { SidebarPageTreeComponents } from "../sidebar/page-tree";
import { getSidebarTabs, type GetSidebarTabsOptions } from "../sidebar/tabs";
import {
  SidebarTabsDropdown,
  type SidebarTabWithProps,
} from "../sidebar/tabs/dropdown";
import { ThemeToggle } from "../theme-toggle";
import {
  LayoutBody,
  LayoutContextProvider,
  LayoutHeader,
  LayoutHeaderTabs,
  NavbarLinkItem,
  NavbarPageActions,
} from "./client";
import {
  Sidebar,
  SidebarCollapseTrigger,
  SidebarContent,
  SidebarDrawer,
  SidebarLinkItem,
  SidebarPageTree,
  SidebarTrigger,
  SidebarViewport,
} from "./sidebar";


import { Tooltip, TooltipContent, TooltipTrigger } from "components/ui/tooltip";

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;
  tabMode?: "sidebar" | "navbar";

  nav?: BaseLayoutProps["nav"] & {
    mode?: "top" | "auto";
  };

  sidebar?: SidebarOptions;

  containerProps?: HTMLAttributes<HTMLDivElement>;
}

interface SidebarOptions
  extends
    ComponentProps<"aside">,
    Pick<ComponentProps<typeof Sidebar>, "defaultOpenLevel" | "prefetch"> {
  components?: Partial<SidebarPageTreeComponents>;

  /**
   * Root Toggle options
   */
  tabs?: SidebarTabWithProps[] | GetSidebarTabsOptions | false;

  banner?: ReactNode | FC<ComponentProps<"div">>;
  footer?: ReactNode | FC<ComponentProps<"div">>;

  /**
   * Support collapsing the sidebar on desktop mode
   *
   * @defaultValue true
   */
  collapsible?: boolean;
}

export function DocsLayout(props: DocsLayoutProps) {
  const {
    tabMode = "sidebar",
    nav = {},
    sidebar: {
      tabs: tabOptions,
      defaultOpenLevel,
      prefetch,
      ...sidebarProps
    } = {},
    i18n = false,
    themeSwitch = {},
    tree,
  } = props;

  const navMode = nav.mode ?? "auto";
  const links = resolveLinkItems(props);
  const tabs = useMemo(() => {
    if (Array.isArray(tabOptions)) {
      return tabOptions;
    }

    if (typeof tabOptions === "object") {
      return getSidebarTabs(tree, tabOptions);
    }

    if (tabOptions !== false) {
      return getSidebarTabs(tree);
    }

    return [];
  }, [tabOptions, tree]);

  function sidebar() {
    const {
      banner,
      footer,
      components,
      collapsible = true,
      ...rest
    } = sidebarProps;

    const iconLinks = links.filter((item) => item.type === "icon");
    const Header =
      typeof banner === "function"
        ? banner
        : ({ className, ...props }: ComponentProps<"div">) => (
            <div
              className={cn(
                "flex flex-col gap-3 p-4 pb-2 empty:hidden",
                className,
              )}
              {...props}
            >
              {props.children}
              {banner}
            </div>
          );
    const Footer =
      typeof footer === "function"
        ? footer
        : ({ className, ...props }: ComponentProps<"div">) => (
            <div
              className={cn(
                "flex flex-col text-fd-muted-foreground items-center p-4",
                iconLinks.length > 0 && "max-lg:flex",
                className,
              )}
              {...props}
            >
              {props.children}
              {footer}
            </div>
          );
    const viewport = (
      <SidebarViewport>
        {links
          .filter((item) => item.type !== "icon")
          .map((item, i, arr) => (
            <SidebarLinkItem
              key={i}
              item={item}
              className={cn("lg:hidden", i === arr.length - 1 && "mb-4")}
            />
          ))}

        <SidebarPageTree {...components} />
      </SidebarViewport>
    );

    const MobileViewport = (
      <SidebarViewport contentClassName="p-8" showGradients={false}>
        {links
          .filter((item) => item.type !== "icon")
          .map((item, i, arr) => (
            <SidebarLinkItem
              key={i}
              item={item}
              className={cn("lg:hidden", i === arr.length - 1 && "mb-4")}
            />
          ))}

        <SidebarPageTree {...components} className="text-xl" />
      </SidebarViewport>
    );

    return (
      <>
        <SidebarContent {...rest}>
          <Header className="h-14">
            {navMode === "auto" && (
              <div className="flex justify-between">
                {renderTitleNav(nav, {
                  className: "inline-flex items-center gap-2.5 font-medium",
                })}
              </div>
            )}
            {tabs.length > 0 && (
              <SidebarTabsDropdown
                options={tabs}
                className={cn(tabMode === "navbar" && "lg:hidden")}
              />
            )}
          </Header>
          {viewport}
        </SidebarContent>
        <SidebarDrawer {...rest}>
          <Header>
            <SidebarTrigger
              className={cn(
                buttonVariants({
                  size: "icon-sm",
                  color: "ghost",
                  className:
                    "ms-auto dark:text-gray-200 text-dark bg-transparent border dark:border-gray-700",
                }),
              )}
            >
              <X />
            </SidebarTrigger>
            {tabs.length > 0 && <SidebarTabsDropdown options={tabs} />}
          </Header>
          {MobileViewport}
          <Footer
            className={cn(
              "hidden flex-row items-center justify-end",
              (i18n || themeSwitch.enabled !== false) && "flex",
              iconLinks.length > 0 && "max-lg:flex",
            )}
          >
            {iconLinks.map((item, i) => (
              <LinkItem
                key={i}
                item={item}
                className={cn(
                  buttonVariants({
                    size: "icon-sm",
                    color: "ghost",
                  }),
                  "text-fd-muted-foreground lg:hidden",
                  i === iconLinks.length - 1 && "me-auto",
                )}
                aria-label={item.label}
              >
                {item.icon}
              </LinkItem>
            ))}
            {i18n && (
              <LanguageToggle>
                <Languages className="size-4.5 text-fd-muted-foreground" />
              </LanguageToggle>
            )}
          </Footer>
        </SidebarDrawer>
      </>
    );
  }

  return (
    <TreeContextProvider tree={tree}>
      <LayoutContextProvider
        navMode={nav.mode ?? "auto"}
        tabMode={tabMode}
        navTransparentMode={nav.transparentMode}
      >
        <Sidebar defaultOpenLevel={defaultOpenLevel} prefetch={prefetch}>
          <LayoutBody {...props.containerProps}>
            {sidebar()}
            <DocsNavbar {...props} links={links} tabs={tabs} />
            {props.children}
          </LayoutBody>
        </Sidebar>
      </LayoutContextProvider>
    </TreeContextProvider>
  );
}

function DocsNavbar({
  links,
  tabs,
  tabMode = "sidebar",
  sidebar: { collapsible: sidebarCollapsible = true } = {},
  searchToggle = {},
  themeSwitch = {},
  nav = {},
  i18n,
}: DocsLayoutProps & {
  links: LinkItemType[];
  tabs: SidebarTabWithProps[];
}) {
  const navMode = nav.mode ?? "auto";
  const showLayoutTabs = tabMode === "navbar" && tabs.length > 0;

  return (
    <LayoutHeader
      id="nd-subnav"
      className={cn(
        "sticky [grid-area:header] flex flex-col top-(--fd-docs-row-1) z-10 backdrop-blur-sm transition-colors data-[transparent=false]:bg-fd-background/80 layout:[--fd-header-height:--spacing(14)]",
        showLayoutTabs && "lg:layout:[--fd-header-height:--spacing(24)]",
      )}
    >
      <div
        data-header-body=""
        className="flex px-4 gap-2 h-14 md:px-6 bg-background"
      >
        <div
          className={cn(
            "items-center",
            navMode === "top" && "flex flex-1",
            navMode === "auto" &&
              "hidden has-data-[collapsed=true]:md:flex max-lg:flex",
          )}
        >
          {sidebarCollapsible && navMode === "auto" && (
            <SidebarCollapseTrigger
              className={cn(
                buttonVariants({
                  color: "ghost",
                  size: "icon-sm",
                }),
                "text-fd-muted-foreground data-[collapsed=false]:hidden max-md:hidden",
              )}
            >
              <SidebarIcon />
            </SidebarCollapseTrigger>
          )}
          {renderTitleNav(nav, {
            className: cn(
              "inline-flex items-center gap-2.5 font-semibold",
              navMode === "auto" && "md:hidden",
            ),
          })}
          {nav.children}
        </div>
        <div className="flex flex-1 items-center justify-end md:gap-2">
          <div className="flex items-center gap-6 empty:hidden max-lg:hidden">
            {links
              .filter((item) => item.type !== "icon")
              .map((item, i) => (
                <NavbarLinkItem key={i} item={item} />
              ))}
          </div>
          {links
            .filter((item) => item.type === "icon")
            .map((item, i) => (
              <LinkItem
                key={i}
                item={item}
                className={cn(
                  buttonVariants({ size: "icon-sm", color: "ghost" }),
                  "text-fd-muted-foreground max-lg:hidden",
                )}
                aria-label={item.label}
              >
                {item.icon}
              </LinkItem>
            ))}
          <div className="flex items-center md:hidden">
            {searchToggle.enabled !== false &&
              (searchToggle.components?.sm ?? (
                <span className="inline-flex">
                  <SearchToggle
                    hideIfDisabled
                    className="p-2 cursor-pointer dark:text-white text-black bg-transparent"
                  />
                </span>
              ))}
            {themeSwitch.enabled !== false && (
              <span className="inline-flex">
                <ThemeToggle
                  mode={themeSwitch.mode ?? "light-dark"}
                  className="border-0 p-2 text-dark dark:fill-white"
                />
              </span>
            )}
            <Link
              href={"https://github.com/omoralabs/omoralabs-docs"}
              target="_blank"
              rel="noopener noreferrer"
              className="size-8 rounded-md p-2 dark:text-white hover:bg-fd-accent transition-opacity inline-flex items-center justify-center"
            >
              <GitHubLogo />
            </Link>
          </div>
          <div className="flex items-center gap-2 max-md:hidden">
            <NavbarPageActions />
            {searchToggle.enabled !== false &&
              (searchToggle.components?.sm ?? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <SearchToggle
                        hideIfDisabled
                        className="p-2 cursor-pointer dark:text-white text-black bg-transparent"
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="dark:bg-black dark:text-gray-200 border bg-white text-gray-700 select-none">
                    <p>Search docs</p>
                  </TooltipContent>
                </Tooltip>
              ))}

            {themeSwitch.enabled !== false && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <ThemeToggle
                      mode={themeSwitch.mode ?? "light-dark"}
                      className="border-0 p-2 text-dark dark:fill-white"
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-transparent dark:text-gray-200 border text-black select-none">
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            )}
            {i18n && (
              <LanguageToggle>
                <Languages className="size-4.5 text-fd-muted-foreground" />
              </LanguageToggle>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"https://github.com/omoralabs/omoralabs-docs"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 rounded-md p-2 dark:text-white hover:bg-fd-accent transition-opacity inline-flex items-center justify-center"
                >
                  <GitHubLogo />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="dark:bg-black dark:text-gray-200 border bg-white text-gray-700 select-none">
                <p>GitHub repo</p>
              </TooltipContent>
            </Tooltip>

            {sidebarCollapsible && navMode === "top" && (
              <SidebarCollapseTrigger
                className={cn(
                  buttonVariants({
                    color: "secondary",
                    size: "icon-sm",
                  }),
                  "text-fd-muted-foreground rounded-full -me-1.5",
                )}
              >
                <SidebarIcon />
              </SidebarCollapseTrigger>
            )}
          </div>
        </div>
      </div>
      {showLayoutTabs && (
        <LayoutHeaderTabs
          data-header-tabs=""
          className="overflow-x-auto border-b px-6 h-10 max-lg:hidden"
          options={tabs}
        />
      )}
    </LayoutHeader>
  );
}
